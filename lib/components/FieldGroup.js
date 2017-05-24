'use strict';

import React, { Component } from 'react';
import FieldsRenderer, {FormlyComponentProps} from './FieldsRenderer';


import {
  View,
  Text
} from 'react-native';


export default class FieldGroup extends Component {
  constructor(props) {
    super(props);
    this.onValueUpdate = this.onValueUpdate.bind(this);
  }

  /*
    this function is passed to the fieldGroup fields which is called when the field value changes.
    when this function is invoked it updates the model of the field group and notifies its parent by calling its parent onValueUpdate
    the invocation continues till reaching formly onValueUpdate
  */
  onValueUpdate(fieldKey, viewValue, modelValue, validationResult) {
    //the field calls this function with its key and the updated value
    //if the fieldGroup have separated model it updates it and send it to the parent model to be updated
    //while if the field group had no separate model it updates send the field key and the new value to its parent to handle updating the model

    if (this.props.config.key) {
      this.props.viewValues[fieldKey] = viewValue;
      this.props.fieldsValidation[fieldKey] = validationResult;

      if (modelValue === undefined)
        delete this.props.model[fieldKey];
      else
        this.props.model[fieldKey] = modelValue;

      this.props.onValueUpdate(this.props.config.key, this.props.viewValues, this.props.model,  this.props.fieldsValidation);
    }
    else
      this.props.onValueUpdate(fieldKey, viewValue, modelValue,validationResult);



  }
  render() {
    var model = this.props.model;
    var viewValues = this.props.viewValues;
    var fieldsValidation = this.props.fieldsValidation;
    var onValueUpdate = this.onValueUpdate;
    var styles = this.props.styles;

    var fields = this.props.config.fieldGroup.map(function (field) {
      var props = new FormlyComponentProps(field, viewValues, model, fieldsValidation, onValueUpdate, styles.Field);
      return FieldsRenderer.generateFieldTag(props);
    }, this);
    return (
      <View style={this.props.styles.Container}>{fields}</View>
    );
  }
}

FieldGroup.propTypes = {
  model: React.PropTypes.object.isRequired,
  config: React.PropTypes.object.isRequired,
  viewValues: React.PropTypes.object.isRequired,
  fieldsValidation: React.PropTypes.object.isRequired,
  onValueUpdate: React.PropTypes.func.isRequired,
  styles: React.PropTypes.shape({
    Container: React.PropTypes.object,
    Field: React.PropTypes.object
  })
};

FieldGroup.defaultProps = {
  model: {},
  styles: {}
};
