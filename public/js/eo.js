/*jshint browser:true, laxcomma:true, indent: 2, eqnull:true, devel:true */
/*global define */

define('eo', ['vendor/asEvented'], function (asEvented) {
  'use strict';
  
  var Eo = function (props, name) {
    if ('string' === typeof props) {
      this._fromJSON(props);
    } else {
      this._fromObject(props);
    }
    
    if (name !== undefined && this.prop('_name') === undefined) {
      this.prop('_name', name);
    }
    
    this.trigger('create');
  };
  asEvented.call(Eo);
      
  Eo.prototype.prop = function (name, val) {
    if (val === undefined) {
      return this._props[name];
    } else {
      this._props[name] = val;
      this.trigger('change:' + name, [name, val]);
      this.trigger('change', [name, val]);
    }
  };
  
  Eo.prototype.toJSON = function () {
    JSON.stringify(this._props);
  };
  
  Eo.prototype._fromJSON = function (json) {
    this._props = JSON.parse(json);
  };
  
  Eo.prototype._fromObject = function (obj) {
    this._props = obj;
  };
  
  Eo.createFromArray = function (arr, map) {
    var ret = [];
    arr.forEach(function (item) {
      if ('function' === typeof map) {
        ret.push(map(new Eo(item)));
      } else {
        ret.push(new Eo(item));
      }
    });
    return ret;
  };
  
  return {
    Eo: Eo
  };
});
