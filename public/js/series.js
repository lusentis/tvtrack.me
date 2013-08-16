/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('series', ['eo'], function (eo) {
  'use strict';
  
  var module = {}
    , Eo = eo.Eo
    , _series;
  
  module.load = function (body) {
    var docSeries = body.doc.series;
    
    if (!Array.isArray(docSeries)) {
      console.warn('body.doc.series is not an array.');
      return;
    }
    
    _series = Eo.createFromArray(docSeries, function _bindEvents(eobj) {
      eobj.on('create', function () {
        console.log('Created', this);
      });
    });
    
    console.log('Series:', _series);
  };
  
  return module;
});