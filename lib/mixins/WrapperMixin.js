'use strict';
var React = require('react');

var WrapperMixin = {
  propTypes: {
    model: React.PropTypes.object,
    config: React.PropTypes.object,
    styles: React.PropTypes.shape({
      Container: React.PropTypes.object
    })
  },
  getDefaultProps: function () {
    return {
      model: {},
      styles: {
        Container: {}
      }
    };
  }
};



module.exports = WrapperMixin;
