/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global require */


require(['vendor/reqwest'], function (reqwest) {
  'use strict';
  
  var $$ = function (id) { return document.querySelector(id); }
    , API_ENDPOINT = '/api/v1';
  
  
  var _login = function (id, rev) {
    if (!id || !rev) { throw new Error('TypeError: id, rev must be strings.'); }
    
    window.localStorage.setItem('_id', id);
    window.localStorage.setItem('_rev', rev);
  };
  
  var _get_login = function () {
    if (!window.localStorage.getItem('_id')) {
      return false;
    }
    
    return {
      _id: window.localStorage.getItem('_id')
    , _rev: window.localStorage.getItem('_rev')
    };
  };
  
  
  if (_get_login() === false) {
    $$('#container-login').style.display = 'block';
  } else {
    $$('#container-list').style.display = 'block';
  }
  
  
  // -~- Signup Form -~-
  
  $$('#signup-form').addEventListener('submit', function (e) {
    var data = {
      name: $$('#signup-name').value
    , passphrase: $$('#signup-passphrase').value
    };
      
    reqwest({
      url: API_ENDPOINT + '/new'
    , method: 'post'
    , type: 'json'
    , data: data
    })
    
    .then(function (body) {
      console.log('Result: ', body);
      _login(body.doc._id, body.doc._rev);
    })
    
    .fail(function (err) {
      alert('Sorry, the API is not available at the moment. Please try again later.');
      console.error('API Error', err);
    });
    
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });
  
});
