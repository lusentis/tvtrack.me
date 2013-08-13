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

  
  $$('#signup-form').addEventListener('submit', function (e) {
    var data = {
      name: $$('#signup-name').value
    , passphrase: $$('#signup-passphrase').value
    };
      
    reqwest({
      url: API_ENDPOINT + '/new'
    , method: 'post'
    , type: 'ajax'
    , data: data
    })
    
    .then(function (body) {
      console.log('Result: ', body);
      _login(body.doc.id, body.doc.rev);
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