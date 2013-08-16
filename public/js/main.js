/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global require */

require(['vendor/reqwest', 'series'], function (reqwest, series) {
  'use strict';
  
  var $$ = function (id) { return document.querySelector(id); }
    , API_ENDPOINT = '/api/v1';
  
  
  // -~- Check login & display login or list -~-
  
  if (_get_login() === false) {
    $$('#container-login').style.display = 'block';
  } else {
    $$('#container-list').style.display = 'block';
    
    // Get my shows from the API
    reqwest({
      url: API_ENDPOINT + '/get'
    , method: 'get'
    , type: 'json'
    , data: { passphrase: _get_login() }
    })
    .then(series.load)
    .fail(_apiFail);
  }
  
  
  // -~- Signup Form Events -~-
  
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
    .then(_login)
    .fail(_apiFail);
    
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });
  
  
  /** Private **/
  
  function _apiFail(err) {
    alert('Sorry, the API is not available at the moment. Please try again later.');
    console.error('API Error', err);
  }
  
    
  function _login(body) {
    var passphrase = body.passphrase;
    
    if (!passphrase) { throw new Error('TypeError: passphrase must be a string.'); }
    
    window.localStorage.setItem('passphrase', passphrase);
  }
  
  
  function _get_login() {
    if (!window.localStorage.getItem('passphrase')) {
      return false;
    }
    
    return window.localStorage.getItem('passphrase');
  }
  
});
