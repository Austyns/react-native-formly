'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FieldsRenderer, { FormlyComponentProps } from './../modules/FieldsRenderer';
import Utils from '../modules/Utils';

import {
  View,
  Text
} from 'react-native';

function typeOrComponent(props, propName, componentName) {
  var errorPrefix = componentName + ' config.fields field with key ' + props.key;
  if (props.type && props.component) {
    return new Error(errorPrefix + ' should only have either a type or a component, not both.');
  } else if (!props.type && !props.component) {
    return new Error(errorPrefix + ' should have either a type (string) or a component (React component)');
  }
}
var hideExpression = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.string,
  PropTypes.func
]);
var wrapper = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string)
]);
var controller = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    componentWillMount: PropTypes.func,
    componentDidMount: PropTypes.func,
    componentWillReceiveProps: PropTypes.func,
    componentWillUpdate: PropTypes.func,
    componentDidUpdate: PropTypes.func,
    componentWillUnmount: PropTypes.func
  })
]);

var field = PropTypes.oneOfType([
  PropTypes.shape(FieldGroupConfig),
  PropTypes.shape(fieldConfig)
]);

var FieldGroupConfig = {
  key: PropTypes.string,
  fieldGroup: PropTypes.arrayOf(field).isRequired,
  hideExpression: hideExpression,
  wrapper: wrapper,
  data: PropTypes.object
}
var fieldConfig = {
  key: PropTypes.string.isRequired,
  type: typeOrComponent.isRequired,
  component: typeOrComponent,
  templateOptions: PropTypes.object,
  expressionProperties: PropTypes.object,
  hideExpression: hideExpression,
  validators: PropTypes.object,
  validation: PropTypes.object,
  controller: PropTypes.oneOfType([
    controller,
    PropTypes.string,
    PropTypes.arrayOf(controller)
  ]),
  wrapper: wrapper,
  modelOptions: PropTypes.shape({
    updateOn: PropTypes.string,
    debounce: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ])
  }),
  props: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func
  ]),
  data: PropTypes.object
};

class Formly extends Component {
  constructor(props) {
    super(props);
    this.state = { formValidation: { isValid: undefined, fields: {} }, viewValues: {} };
  }

  onValueUpdate = (fieldKey, viewValue, modelValue, validationResult) => {
    if (!Utils.deepEqual(this.state.viewValues[fieldKey], viewValue)) {
      var currentViewValuesState = this.state.viewValues;
      currentViewValuesState[fieldKey] = viewValue;
      this.setState({ viewValues: currentViewValuesState });
    }



    //only update the validation state if the new validation is different from the previous to prevent infinite rendering updates
    //infinite loops happens as the form validation causes rerendering the form fields and form fields update causes revalidating the fields.
    if (!Utils.deepEqual(this.state.formValidation.fields[fieldKey], validationResult)) {
      var currentValidationState = this.state.formValidation;
      currentValidationState.fields[fieldKey] = validationResult;
      this.setState({ formValidation: currentValidationState });
      this.updateFormValidity();
    }

    if (modelValue === undefined)
      delete this.props.model[fieldKey];
    else
      this.props.model[fieldKey] = modelValue;

    this.props.onFormlyUpdate(this.props.model);


  }

  updateFormValidity = () => {
    var prevFormValidity = this.state.formValidation.isValid;
    var newFormValidity = true;
    var iterateThrough = function (obj) {
      if (newFormValidity && Object(obj) === obj) // loop only if the current form validity is true && obj is type of object
        for (const key of Object.keys(obj)) {
          if (obj[key].hasOwnProperty('isValid')) {
            if (!obj[key].isValid) {
              newFormValidity = false;
            }
          }
          else
            iterateThrough(obj[key]);
        };
    };

    iterateThrough(this.state.formValidation.fields);


    this.state.formValidation.isValid = newFormValidity;
    if (this.props.onFormlyValidityChange && prevFormValidity !== this.state.formValidation.isValid) {
      this.props.onFormlyValidityChange(this.state.formValidation.isValid);
    }

  }
  
  render() {
    var model = this.props.model;
    var viewValues = this.state.viewValues;
    var fieldsValidation = this.state.formValidation.fields;
    var onValueUpdate = this.onValueUpdate;
    var fields = this.props.config.fields.map(function (field) {
      var props = new FormlyComponentProps(field, viewValues, model, fieldsValidation, onValueUpdate);
      return FieldsRenderer.generateFieldTag(props);
    });
    return (
      <View style={{ flex: 1 }}>
        {fields}
      </View>
    );
  }
}
Formly.defaultProps  = { model: {} }

Formly.propTypes = {
  onFormlyUpdate: PropTypes.func.isRequired,
  config: PropTypes.shape({
    name: PropTypes.string,
    fields: PropTypes.arrayOf(field)
  }),
  model: PropTypes.object
}


module.exports = Formly;
