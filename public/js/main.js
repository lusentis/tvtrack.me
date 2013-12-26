/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global require */

require(['vendor/reqwest', 'series'], function (reqwest, series) {
  'use strict';
  
  var $$ = function (id) { return document.querySelector(id); }
    , API_ENDPOINT = '/api/v1'
    , saveTimerPause = false
    , saveTimer
    ;
  
  
  // -~- Check login & display login or list -~-
  
  if (_get_login() === false) {
    $$('#container-login').style.display = 'block';
    $$('#logout').classList.add('hide');
  } else {
    $$('#container-list').style.display = 'block';
    _loadSeries();
  }
  
  
  // -~- Events -~-
  
  $$('#logout').addEventListener('click', function (e) {
    window.localStorage.removeItem('passphrase');
    window.location.reload();
    e.preventDefault();
    return false;
  });
  
  
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
    .then(function () { _login(data.passphrase); })
    .fail(_apiFail);
    
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });
  
  
  $$('#login-form').addEventListener('submit', function (e) {
    var passphrase = $$('#login-passphrase').value;
      
    reqwest({
      url: API_ENDPOINT + '/get'
    , method: 'get'
    , type: 'json'
    , data: { passphrase: passphrase }
    })
    .then(function () { _login(passphrase); })
    .fail(_apiFail);
    
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });
  
  
  series.on('shouldsave', function (series) {
    console.log('Saving', series);
    
    saveTimerPause = true;
    $$('#lastSaved').innerHTML = 'saving right now...';
    
    // Get my shows from the API
    reqwest({
      url: API_ENDPOINT + '/save'
    , method: 'put'
    , type: 'json'
    , data: { passphrase: _get_login(), series: series }
    })
    .then(function () {
      console.log('Save succeded');
      saveTimerPause = false;
      $$('#lastSaved').innerHTML = 'last saved ' + moment().fromNow();
      $$('#lastSaved').setAttribute('last-save', new Date().toISOString());
    })
    .fail(_apiFail);
  });
  
  saveTimer = setInterval(function () {
    if (saveTimerPause) return;    
    $$('#lastSaved').innerHTML = 'last saved ' + moment($$('#lastSaved').getAttribute('last-save')).fromNow();
  }, 2000);
  
  
  /** Private **/
  
  function _loadSeries() {
    $$('#shows-container').innerHTML = '';
    
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
  
  
  function _apiFail(err) {
    alert('Please, try again later.');
    console.error('API Error', err);
  }
  
    
  function _login(passphrase) {
    if (!passphrase) { throw new Error('TypeError: passphrase must be a string.'); }
    window.localStorage.setItem('passphrase', passphrase);
    window.location.reload();
  }
  
  
  function _get_login() {
    if (window.localStorage.getItem('passphrase') === null) {
      return false;
    }
    
    return window.localStorage.getItem('passphrase');
  }
  
});
