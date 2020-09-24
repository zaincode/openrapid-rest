// Cryptonite module by Royan Zain 
// Used for easily encrypt and decrypt strings using secret key
// Created at october 28th 2019
// Version : v.1.0

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

let Cryptonite = {
	aes : {
		// Nodejs encryption with CTR
		encrypt(text) {
		 	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
		 	let encrypted = cipher.update(text);
		 	encrypted = Buffer.concat([encrypted, cipher.final()]);
		 	return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
		},
		decrypt(text) {
		 	let iv = Buffer.from(text.iv, 'hex');
		 	let encryptedText = Buffer.from(text.encryptedData, 'hex');
		 	let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
		 	let decrypted = decipher.update(encryptedText);
		 	decrypted = Buffer.concat([decrypted, decipher.final()]);
		 	return decrypted.toString();
		}
	},
}


module.exports = Cryptonite;
