const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors({
    origin: true, // This automatically accepts the incoming frontend port (like 5174)
    credentials: true
}));
app.use(express.json());

// In-memory sessions
const sessions = {};
let transferCounter = 1;

// Helper to truncate long strings for the UI
const truncate = (str) => {
    if (!str) return str;
    if (str.length <= 20) return str;
    return str.substring(0, 10) + "..." + str.substring(str.length - 10);
};

// RSA Key Generation
const generateRSAKeys = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
};

// Start Session API
app.post('/api/session/start', (req, res) => {
    const { user1, user2 } = req.body;
    
    if (!user1 || !user2 || user1.trim() === user2.trim()) {
        return res.status(400).json({ success: false, message: 'Invalid usernames' });
    }

    const sessionId = "SC-" + new Date().getFullYear() + "-" + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Generate simulated key pairs for both users
    const user1Keys = generateRSAKeys();
    const user2Keys = generateRSAKeys();
    
    sessions[sessionId] = {
        user1, user2,
        keys: {
            [user1]: user1Keys,
            [user2]: user2Keys
        }
    };
    
    res.json({ sessionId, status: 'SUCCESS' });
});

// Send Message API
app.post('/api/messages/send', (req, res) => {
    const { sessionId, sender, receiver, message } = req.body;
    const context = sessions[sessionId];
    
    if (!context || !context.keys[sender] || !context.keys[receiver]) {
        return res.status(400).json({ success: false, message: 'Invalid session or users' });
    }
    
    const transferId = `TR-${String(transferCounter++).padStart(3, '0')}`;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const steps = [];

    try {
        // STEP 1: PLAINTEXT
        steps.push({
            stepName: "PLAINTEXT", description: "Original message received from sender",
            algorithm: "None", details: message, status: "Success"
        });

        // STEP 2: AES-GCM ENCRYPTION
        // Generate random AES session key (32 bytes = 256 bits) and IV (12 bytes)
        const aesKey = crypto.randomBytes(32);
        const iv = crypto.randomBytes(12);
        
        const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
        let ciphertext = cipher.update(message, 'utf8');
        ciphertext = Buffer.concat([ciphertext, cipher.final()]);
        const authTag = cipher.getAuthTag();
        
        steps.push({
            stepName: "AES ENCRYPTION", description: "Message encrypted with unique IV",
            algorithm: "AES-256-GCM", 
            details: `IV: ${truncate(iv.toString('base64'))}\nCiphertext: ${truncate(ciphertext.toString('base64'))}\nAuth Tag: ${truncate(authTag.toString('base64'))}`,
            status: "Success"
        });

        // STEP 3: RSA KEY PROTECTION
        // Encrypt AES key using receiver's public key (RSA-OAEP with SHA-256)
        const receiverPublicKey = context.keys[receiver].publicKey;
        const encryptedAesKey = crypto.publicEncrypt({
            key: receiverPublicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        }, aesKey);

        steps.push({
            stepName: "RSA KEY PROTECTION", description: "AES session key encrypted with receiver's public key",
            algorithm: "RSA-OAEP", details: `Encrypted AES Key: ${truncate(encryptedAesKey.toString('base64'))}`, status: "Success"
        });

        // STEP 4: SECURE TRANSMISSION
        steps.push({
            stepName: "SECURE TRANSMISSION", description: "Encrypted payload transmitted through backend",
            algorithm: "Network", details: "Payload sent to receiver", status: "Success"
        });

        // STEP 5: RSA KEY RECOVERY
        // Decrypt AES key using receiver's private key
        const receiverPrivateKey = context.keys[receiver].privateKey;
        const recoveredAesKey = crypto.privateDecrypt({
            key: receiverPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256'
        }, encryptedAesKey);

        steps.push({
            stepName: "RSA KEY RECOVERY", description: "AES session key decrypted with receiver's private key",
            algorithm: "RSA-OAEP", details: "AES key successfully recovered", status: "Success"
        });

        // STEP 6 & 7: AES DECRYPTION AND INTEGRITY VERIFICATION
        const decipher = crypto.createDecipheriv('aes-256-gcm', recoveredAesKey, iv);
        decipher.setAuthTag(authTag);
        let decryptedMessage = decipher.update(ciphertext, undefined, 'utf8');
        decryptedMessage += decipher.final('utf8');

        steps.push({
            stepName: "AES DECRYPTION", description: "Ciphertext successfully decrypted",
            algorithm: "AES-256-GCM", details: "Ciphertext to Plaintext", status: "Success"
        });
        steps.push({
            stepName: "INTEGRITY VERIFICATION", description: "Authentication tag validated successfully",
            algorithm: "GCM Auth Tag", details: "Status: VALID", status: "Success"
        });

        res.json({
            transferId, timestamp, sender, receiver,
            status: "SUCCESS", algorithm: "AES-256-GCM", keyProtection: "RSA-OAEP", integrity: "VALID",
            finalMessage: decryptedMessage,
            steps
        });
        
    } catch (err) {
        steps.push({
            stepName: "ERROR", description: "Cryptographic operation failed",
            algorithm: "Unknown", details: err.message, status: "Failed"
        });
        res.status(400).json({ success: false, errorCode: "CRYPTO_OPERATION_FAILED", message: err.message, steps });
    }
});

const PORT = 8080;
app.listen(PORT, () => console.log(`🚀 Node.js SecureCrypt backend running on port ${PORT}`));
