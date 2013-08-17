/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('series', ['eo', 'vendor/t', 'vendor/ancestry'], function (eo, T, ancestry) {
  'use strict';
  
  var module = {}
    , $$ = function (id) { return document.querySelector(id); }
    , Eo = eo.Eo
    , _series
    , shows_container = $$('#shows-container')
    , show_template = new T($$('#show-template').innerHTML);
  
  
  // -$- the Show class -$-
  
  function Show(props) {
    Show.superconstructor.call(this, props);
  }
  
  ancestry.inherit(Show, Eo, {
    render: function () {
      var wrapper = document.createElement('table')
        , that = this;
        
      wrapper.innerHTML = show_template.render(this.val());
      
      Array.prototype.forEach.call(wrapper.querySelectorAll('[contenteditable="true"]'), function (el) {
        el.addEventListener('blur', function () {
          that.trigger('change');
        });
      });
      
      shows_container.appendChild(wrapper.querySelector('tr'));
    },
    
    handleChange: function () {
      alert('Imma changing');
    }
  });
  
  
  // -$- Exports -$-
  
  module.load = function (body) {
    var docSeries = body.doc.series;
    
    if (!Array.isArray(docSeries)) {
      console.error('body.doc.series is not an array.');
      return;
    }
    
    _series = Eo.createFromArray(docSeries, function _bindEvents(show) {
      show.on('create', function () {
        console.log('Created');
      });
      
      show.on('change', function () {
        console.log('Changed');
      });
    }, Show);
    
    console.log('Series:', _series);
    
    var emptyRow = new Show({ title: 'Type here to add a new TV show', last_episode: 's01e01', last_date: null }, Show);
    emptyRow.on('create', function () {
      this.render();
    });
    emptyRow.on('change', function () {
      this.handleChange();
    });
  };
  
  return module;
});
