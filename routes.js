/*jshint node:true, laxcomma:true, indent: 2, eqnull:true */

'use strict';

var API_BASE_URL = 'http://tvtrack.me/';

require('sugar');

var db = require('nano')(process.env.DATABASE_URL)
  , coolog = require('coolog')
  , uuid = require('uuid')
  , is = require('is-validation')
  ;
  
var logger = coolog.logger('routes.js');


exports.index = function (req, res) {
  res.render('index');
};


exports.create = function (req, res) {
  var name = req.param('name') || 'John Doe'
    , passphrase = req.param('passphrase')
    , _id = uuid.v4();

  var valid_passphrase = is.that(passphrase, 'passphrase')
    .str()
    .prop('length')
      .gt(10)
      .lt(500).valid();

  if (!valid_passphrase) {
    res
      .status(400)
      .json({ error: 'Missing or invalid parameter: passphrase.' });

    return;
  }

  res.json({ result: 'ok', error: null });

};


exports.get = function (req, res) {
  var url = req.param('url').replace(API_BASE_URL, '');
  
  db.get(url, function (err, doc) {
    if (err) {
      if (err.statusCode !== 404) {
        logger.error('Error', err);
      }
      
      res.status(404).send('Not found');
      return;
    }
    
    res.json(Object.select(doc, ['l', 's', 't', 'd']));
  });
};


exports.save = function (req, res) {
  var shortUrl = req.param('url').replace(API_BASE_URL, '')
    , title = req.param('title').substr(0, 50)
    , passphrase = req.param('passphrase');

  if (passphrase && shortUrl.length > 1) {
      
    db.atomic('cuttr', 'url', shortUrl, {
      action: 'setTitle'
    , passphrase: passphrase
    , title: title
    }, function (err) {
      if (err) {
        logger.error('DB Error in post:', err);
        res.status(500).end('Internal server error');
        return;
      }
      
      res.type('text').end('ok');
    });
    
  } else {
    res.status(400).end('Bad passphrase or URL');
  }
};
