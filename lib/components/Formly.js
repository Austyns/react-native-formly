'use strict';

var React = require('react');
import FieldsRenderer, { FormlyComponentProps } from './FieldsRenderer';
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
var hideExpression = React.PropTypes.oneOfType([
  React.PropTypes.bool,
  React.PropTypes.string,
  React.PropTypes.func
]);
var wrapper = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.arrayOf(React.PropTypes.string)
]);
var controller = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.shape({
    componentWillMount: React.PropTypes.func,
    componentDidMount: React.PropTypes.func,
    componentWillReceiveProps: React.PropTypes.func,
    componentWillUpdate: React.PropTypes.func,
    componentDidUpdate: React.PropTypes.func,
    componentWillUnmount: React.PropTypes.func
  })
]);

var field = React.PropTypes.oneOfType([
  React.PropTypes.shape(FieldGroupConfig),
  React.PropTypes.shape(fieldConfig)
]);

var FieldGroupConfig = {
  key: React.PropTypes.string,
  fieldGroup: React.PropTypes.arrayOf(field).isRequired,
  hideExpression: hideExpression,
  wrapper: wrapper,
  data: React.PropTypes.object
}
var fieldConfig = {
  key: React.PropTypes.string.isRequired,
  type: typeOrComponent.isRequired,
  component: typeOrComponent,
  templateOptions: React.PropTypes.object,
  expressionProperties: React.PropTypes.object,
  hideExpression: hideExpression,
  validators: React.PropTypes.object,
  validation: React.PropTypes.object,
  controller: React.PropTypes.oneOfType([
    controller,
    React.PropTypes.string,
    React.PropTypes.arrayOf(controller)
  ]),
  wrapper: wrapper,
  modelOptions: React.PropTypes.shape({
    updateOn: React.PropTypes.string,
    debounce: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.object
    ])
  }),
  props: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.func
  ]),
  data: React.PropTypes.object
};

var Formly = React.createClass({
  propTypes: {
    onFormlyUpdate: React.PropTypes.func.isRequired,
    config: React.PropTypes.shape({
      name: React.PropTypes.string,
      fields: React.PropTypes.arrayOf(field)
    }),
    model: React.PropTypes.object
  },
  getInitialState: function () {
    return { formValidation: { isValid: undefined, fields: {} }, viewValues: {} };
  },
  getDefaultProps: function () {
    return { model: {} };
  },

  onValueUpdate: function (fieldKey, viewValue, modelValue, validationResult) {
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


  },
  updateFormValidity() {
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

  },
  render: function () {
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
});


module.exports = Formly;
