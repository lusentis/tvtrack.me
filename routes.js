/*jshint node:true, laxcomma:true, indent: 2, eqnull:true */

'use strict';

var API_BASE_URL = 'http://tvtrack.me/';

require('sugar');

var db = require('nano')(process.env.DATABASE_URL)
  , coolog = require('coolog')
  , uuid = require('uuid')
  , is = require('is-validation')
  , crypto = require('crypto')
  ;
  
var logger = coolog.logger('routes.js');


function _validatePassphrase(res, passphrase) {
  var valid_passphrase = is.that(passphrase, 'passphrase')
  .str()
  .prop('length')
    .gt(10)
    .lt(500).valid();

  if (!valid_passphrase) {
    return res
      .status(400)
      .json({ error: 'Missing or invalid parameter: passphrase.' });
  }
  
  return crypto.createHash('sha512').update(passphrase).digest('hex');
}


exports.index = function (req, res) {
  res.render('index');
};


exports.create = function (req, res, next) {
  var name = req.param('name') || 'John Doe'
    , passphrase = req.param('passphrase');

  passphrase = _validatePassphrase(res, passphrase);
  
  db.insert({
    name: name
  , passphrase: passphrase
  , series: []
  , created_on: new Date()
  }, undefined, function (err) {
    if (err) {
      return next(err);
    }
    
    res.status(201).json({ result: 'ok', error: null });
  });
};


exports.get = function (req, res, next) {
  var passphrase = req.param('passphrase');
  passphrase = _validatePassphrase(res, passphrase);
  
  _getUserByPassphrase(res, passphrase, function (doc) {
    res.json({ result: 'ok', error: null, doc: Object.select(doc, ['series', 'name', 'created_on']) });
  });
};


exports.save = function (req, res) {
  var passphrase = req.param('passphrase')
    , series = req.param('series');
  
  passphrase = _validatePassphrase(res, passphrase);
  series = JSON.parse(series);
  
  _getUserByPassphrase(res, passphrase, function (doc) {
    doc.series = series;
    db.insert(doc, doc._id, function (err) {
      if (err) {
        console.log('Error while updating user document:', err);
        
        return res
          .status(500)
          .json({ error: 'Server error.' });
      }
      
      res.status(201).end('"OK"');
    });
  });
};


/** Helpers **/

function _getUserByPassphrase(res, passphrase, callback) {
  db.view('tvtrack', 'by_passphrase', { key: passphrase, include_docs: true }, function (err, body) {
    if (err) {
      return next(err);
    }
    
    if (body.rows.length !== 1 || body.rows[0].doc === undefined) {
      return res
        .status(404)
        .json({ error: 'Not found' });
    }
    
    var doc = body.rows[0].doc;
    callback(doc);
  });
}
