/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('series', ['eo', 'vendor/t'], function (eo, T) {
  'use strict';
  
  var module = {}
    , $$ = function (id) { return document.querySelector(id); }
    , Eo = eo.Eo
    , _series
    , shows_container = $$('#shows-container')
    , show_template = new T($$('#show-template').innerHTML);
  
  
  module.load = function (body) {
    var docSeries = body.doc.series;
    
    if (!Array.isArray(docSeries)) {
      console.error('body.doc.series is not an array.');
      return;
    }
    
    _series = Eo.createFromArray(docSeries, function _bindEvents(eobj) {
      eobj.on('create', function () {
        console.log('Created', this);
      });
    });
    
    console.log('Series:', _series);
    
    var emptyRow = new Eo({ title: 'Type here to add a new TV series', last_episode: 's01e01', last_date: null });
    emptyRow.on('create', function () {
      shows_container.innerHTML = shows_container.innerHTML + show_template.render(emptyRow.val());
    });
  };
  
  return module;
});