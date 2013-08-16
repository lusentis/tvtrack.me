/*jshint couch:true */
function (doc) {
	'use strict';
	
  if (doc.passphrase) {
    emit(doc.passphrase, null);
  }
}