/**
 * @fileoverview  Tests for the crypto namespace.
 */

goog.provide('life.test.crypto');

goog.require('life');
goog.require('life.crypto');
goog.require('life.utils');
goog.require('life.views.Base');


/**
 * Tests for the crypto namespace.
 */
life.test.crypto.run = function() {
  module('life.crypto');

  test('getPassphrase.test', function() {
    var view = new life.views.Base();
    view.el = '#qunit-fixture';
    view.render();
    $(life.crypto.PASSPHRASE_SELECTOR).val('foo');
    equal(
      life.crypto.getPassphrase(),
      'foo',
      'The passphrase method should return the desired value.'
    );
  });

  test('encrypt.test', function() {
    var passphrase = 'foo';
    var message = 'bar';
    notEqual(
      life.crypto.encrypt(message, passphrase),
      message,
      'Encrypted text should not be the same as the original message.'
    );
    notEqual(
      life.crypto.encrypt(message, 'baz'),
      life.crypto.encrypt(message, passphrase),
      'A message encrypted with different passphrases should not be the same.'
    );
  });

  test('decrypt.test', function() {
    var passphrase = 'foo';
    var message = 'bar';
    var encryptedMessage = life.crypto.encrypt(message, passphrase);
    equal(
      life.crypto.decrypt(encryptedMessage, passphrase),
      message,
      'A correct passphrase should decrypt the message.'
    );
    notEqual(
      life.crypto.decrypt(encryptedMessage, 'baz'),
      message,
      'An incorrect passphrase should not decrypt the message.'
    );
  });

  test('encryptDoc.test', function() {
    var template = life.DEFAULT_APPS['passwords'].template;
    var passphrase = 'foo';
    var doc = {
      'title': 'ama title',
      'link': 'ama link',
      'username': 'ama username'
    };
    var originalDoc = life.utils.clone(doc);
    life.crypto.encryptDoc(doc, undefined, passphrase);
    equal(
      _.isEqual(doc, originalDoc),
      true,
      'Not passing a model template should not modify the document.'
    );
    // Use the password app as a template that includes encrypted and
    // non-encrypted properties.
    life.crypto.encryptDoc(doc, template, passphrase);
    equal(
      _.isEqual(doc, originalDoc),
      false,
      'A document with encrypted fields should be modified after encryption.'
    );
  });

  test('decryptDoc.test', function() {
    var template = life.DEFAULT_APPS['passwords'].template;
    var passphrase = 'foo';
    var doc = {
      'title': 'ama title',
      'link': 'ama link',
      'username': 'ama username'
    };
    var originalDoc = life.utils.clone(doc);
    life.crypto.encryptDoc(doc, template, passphrase);
    equal(
      _.isEqual(doc, originalDoc),
      false,
      'A document with encrypted fields should be modified after encryption.'
    );
    ok(
      life.crypto.decryptDoc(doc, template, 'baz') > 0,
      'A bad passphrase should return decryption warnings.'
    );
    // Restore the state of the original doc.
    doc = life.utils.clone(originalDoc);
    life.crypto.encryptDoc(doc, template, passphrase);
    equal(
      life.crypto.decryptDoc(doc, template, passphrase),
      0,
      'A good passphrase should not return decryption warnings.'
    );
    equal(
      _.isEqual(doc, originalDoc),
      true,
      'A document with encrypted fields should be decrypted after decryption.'
    );
  });
};
