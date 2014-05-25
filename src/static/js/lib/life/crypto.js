/**
 * @fileoverview Library of encryption methods.
 */

goog.provide('life.crypto');


/**
 * The selector of the passphrase input field.
 *
 * @const {string}
 */
life.crypto.PASSPHRASE_SELECTOR = '#passphrase';


/**
 * Fetch the current encryption passphrase.
 *
 * Use should use this method fetch the encryption passphase always and never
 * store it in memory (i.e. as a object instance property). This will ensure
 * that you always have the latest value and that once a user clears out the
 * password field the value is lost.
 *
 * @return {string} The current passphrase as set by the user.
 */
life.crypto.getPassphrase = function() {
  return $(life.crypto.PASSPHRASE_SELECTOR).val();
};


/**
 * Encrypts the given text with the current passphrase.
 *
 * @param {string} value The value to encrypt.
 * @param {string=} passphrase Passphrase to use. Otherwise fetches default
 *     passphrase {@see life.crypto.getPassphrase}.
 * @return {string} The encrypted text.
 */
life.crypto.encrypt = function(value, passphrase) {
  passphrase = passphrase || life.crypto.getPassphrase();
  return CryptoJS.AES.encrypt(value, passphrase).toString();
};


/**
 * Decrypts the given text with the current passphrase.
 *
 * @param {string} value The value to decrypt.
 * @param {string=} passphrase Passphrase to use. Otherwise fetches default
 *     passphrase {@see life.crypto.getPassphrase}.
 * @return {string} The decrypted text.
 */
life.crypto.decrypt = function(value, passphrase) {
  passphrase = passphrase || life.crypto.getPassphrase();
  return CryptoJS.AES.decrypt(value, passphrase).toString(CryptoJS.enc.Utf8);
};


/**
 * Encrypt the given document.
 *
 * @param {Object} doc The document to encrypt. NOTE: The document is encrypted
 *     in place (does not make a clone of the object).
 * @param {Object} template The document template.
 * @param {string=} passphrase Passphrase to use. Otherwise fetches default
 *     passphrase {@see life.crypto.getPassphrase}.
 */
life.crypto.encryptDoc = function(doc, template, passphrase) {
  passphrase = passphrase || life.crypto.getPassphrase();
  if(!_.isEmpty(doc)) {
    _.each(template, function(t) {
      if(t.encrypted && _.has(doc, t.key)) {
        doc[t.key] = life.crypto.encrypt(doc[t.key], passphrase);
      }
    });
  }
};


/**
 * Decrypt the given document.
 *
 * @param {Object} doc The document to decrypt. NOTE: The document is decrypted
 *     in place (does not make a clone of the object).
 * @param {Object} template The document template.
 * @param {string=} passphrase Passphrase to use. Otherwise fetches default
 *     passphrase {@see life.crypto.getPassphrase}.
 * @return {number} The number of fields that decryption MAY have failed for.
 */
life.crypto.decryptDoc = function(doc, template, passphrase) {
  passphrase = passphrase || life.crypto.getPassphrase();
  var warn = 0;
  if(!_.isEmpty(doc)) {
    // Try to decrypt document. We cannot actually detect a decryption
    // failure but we can guess a failure if encrypted fields decrypt as
    // empty strings.
    _.each(template, function(t) {
      if(t.encrypted && _.has(doc, t.key)) {
        doc[t.key] = life.crypto.decrypt(doc[t.key], passphrase);
        if(!doc[t.key]) {
          // If the decrypted value is empty it may be a bad passphrase.
          warn++;
        }
      }
    });
  }

  return warn;
};
