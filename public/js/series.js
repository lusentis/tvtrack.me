/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('series', ['eo', 'vendor/t', 'vendor/asEvented', 'vendor/ancestry'], function (eo, T, asEvented, ancestry) {
  'use strict';
  
  var module = {}
    , $$ = function (id) { return document.querySelector(id); }
    , Eo = eo.Eo
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
      
      // Blur events
      Array.prototype.forEach.call(wrapper.querySelectorAll('[contenteditable="true"]'), function (el) {
        el.addEventListener('blur', function (e) {
          that.prop(e.target.getAttribute('data-id'), e.target.innerHTML);
        });
      });
      
      // Bump season/episode button
      Array.prototype.forEach.call(wrapper.querySelectorAll('[data-action="bump-episode"]'), function (el) {
        el.addEventListener('click', function (e) {
          var cur_episode = that.prop('last_episode').split('e')
            , season = cur_episode[0]
            , episode = parseInt(cur_episode[1], 10) + 1
            , next_episode = season + 'e' + ((episode < 10) ? '0' : '') + episode;
          
          that.prop('last_episode', next_episode);
        });
      });
      
      shows_container.appendChild(wrapper.querySelector('tr'));
    }
  });
  
  
  // -$- Exports -$-
  
  module.load = function (body) {
    var docSeries = body.doc.series
      , series;
    
    if (!Array.isArray(docSeries)) {
      console.error('body.doc.series is not an array.');
      return;
    }
    
    docSeries.push({ title: 'Type here to add a new TV show', last_episode: 's01e01', comment: null, placeholder: true });
    
    $$('#lastSaved').setAttribute('last-save', body.doc.updated_on);
    
    series = Eo.createFromArray(docSeries, function _bindEvents(show) {
      show.on('create', function () {
        this.render();
      });
      
      show.on('change', function () {
        console.log('Change handler: -> _triggerSave');
        show.prop('placeholder', false, true /*don't trigger another change event*/);
        _triggerSave(series);
      });
      
      show.on('change:last_episode', function () {
        shows_container.querySelector('[data-show-title="' + show.prop('title') + '"] [data-id="last_episode"]').innerHTML = show.prop('last_episode');
      });
      
      return show;
    }, Show);
    
    console.log('Series:', series);
  };
  
  
  // -$- Private -$-
  
  function _triggerSave(series) {
    var series_wo_placeholder = [];
    series.forEach(function _filterAndUnpack(item) {
      if (!item.prop('placeholder')) {
        series_wo_placeholder.push(item.val());
      }
    });

    module.trigger('shouldsave', JSON.stringify(series_wo_placeholder));
  }
  
  asEvented.call(module);
  return module;
});
