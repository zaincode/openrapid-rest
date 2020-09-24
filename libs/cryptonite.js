// Cryptonite module by Royan Zain 
// Used for easily encrypt and decrypt strings using secret key
// Created at october 28th 2019
// Version : v.1.0

const CryptoJS = require('crypto-js');

const CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
       return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        var j = JSON.parse(jsonStr);
        var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
        return cipherParams;
    }
}

let Cryptonite = {
	aes : {
		encrypt : (secret, data) => {
			// Chiper the data
			const encrypted_text = CryptoJS.AES.encrypt(JSON.stringify(data), secret, {format: CryptoJSAesJson}).toString();
			return encrypted_text;
		},
		decrypt : (secret, encrypted_text) => {
			// Decrypt the message using CryptoJSAesJson format
			var decrypted_message = CryptoJS.AES.decrypt( encrypted_text, secret, {format: CryptoJSAesJson} ).toString(CryptoJS.enc.Utf8);
			return decrypted_message;
		},
	}
}

module.exports = Cryptonite;