/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('series', ['eo', 'vendor/t'], function (eo, T) {
  'use strict';
  
  var module = {}
    , $$ = function (id) { return document.querySelector(id); }
    , Eo = eo.Eo
    , _series
    , shows_container = $$('#shows-container')
    , template = $$('#show-template').innerHTML;
  
  
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
    
    var emptyRow = new Eo({ title: 'Type here to add a new TV series', last_episode: 's01e01', last_date: null }, 'empty');
    emptyRow.on('create', function () {
      var tpl = new T(template);
      shows_container.innerHTML = shows_container.innerHTML + tpl.render(emptyRow.val());
    });
  };
  
  return module;
});