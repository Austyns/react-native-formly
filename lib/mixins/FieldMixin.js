'use strict';
var React = require('react');
import FieldValidator from './../modules/Validation';
import FieldControllers from './../modules/FormlyControllers';
import FormlyModelOptions from './../modules/FormlyModelOptions';
import Utils from './../modules/Utils';

var FieldMixin = function () {
  return {
    getDefaultProps: function () {
      return {
        model: {}
      };
    },
    getInitialState: function () {
      //initialize the field validator & field controller
      return {
        fieldControllers: new FieldControllers(this, this.props.config),
        fieldValidator: new FieldValidator(),
        focused: false
      };
    },
    componentWillMount: function () {
      this.state.fieldControllers.runComponentWillMount();
    },
    componentDidMount: function () {
      this.state.fieldControllers.runComponentDidMount();

      //run change logic on the supplied values by the model
      this.onChange(this.props.model[this.props.config.key]);
    },
    componentWillReceiveProps(nextProps) {
      this.state.fieldControllers.runComponentWillReceiveProps(nextProps);

      if (nextProps.config && nextProps.config.hasOwnProperty('expressionProperties') && !Utils.deepEqual(nextProps.config, this.props.config)) {
        this.validateField(nextProps.viewValues[nextProps.config.key], nextProps);
      }
    },
    componentWillUpdate: function (nextProps, nextState) {
      this.state.fieldControllers.runComponentWillUpdate(nextProps, nextState);

    },
    componentDidUpdate: function (prevProps, prevState) {
      this.state.fieldControllers.runComponentDidUpdate(prevProps, prevState);

    },
    componentWillUnmount: function () {
      this.state.fieldControllers.runComponentWillUnmount();
    },
    onChange: function (value) {
      this.updateValue(value);
    },
    onFocus: function (value) {
      //this.updateValue(value);
    },
    shouldValueUpdate: function (event) {

    },
    updateValue: function (viewValue) {
      if (this.transformUpdate) {
        viewValue = this.transformUpdate(viewValue);
      }
      this.validateField(viewValue, this.props);

    },
    validateField(viewValue, props) {
      this.state.fieldValidator.validateField(viewValue, props.model[this.props.config.key], props.model, props.config, this.onValidationsUpdate(viewValue, props));
    },
    //pass on validations update with props to work with
    onValidationsUpdate(viewValue, props) {
      return function (fieldValidationResult) {
        var modelValue = fieldValidationResult.isValid ? viewValue : undefined;
        props.onValueUpdate(props.config.key, viewValue, modelValue, fieldValidationResult);
      }
    }

  };



}

module.exports = new FieldMixin();
