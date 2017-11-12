'use strict';
import React, { Component } from 'react';
import {FieldsConfig, WrappersConfig} from './../formlyConfig';

import FieldGroup from './../components/FieldGroup';
import FormlyExpressions from './FormlyExpressions';
import Utils from './Utils';
import {
  View,
  Text
} from 'react-native';

class FieldProps {
  constructor(key, config, viewValues, model, fieldValidation, onValueUpdate, styles) {
    this.key = key;
    this.config = config;
    this.viewValues = viewValues;
    this.model = model;
    this.fieldValidation = fieldValidation;
    this.onValueUpdate = onValueUpdate;
    this.styles = styles;
  }
  get props() {
    var props = {};
    for (const key of Object.keys(this)) {
      props[key] = this[key];
    }
    return props;
    //return {key:this.key, config:this.config, viewValues:this.viewValues, model:this.model, fieldValidation:this.fieldValidation, onValueUpdate:this.onValueUpdate, styles:this.styles };

  }
}

class FieldGroupProps {
  constructor(key, config, viewValues, model, fieldsValidation, onValueUpdate, styles) {
    this.key = key;
    this.config = config;
    this.viewValues = viewValues;
    this.model = model;
    this.fieldsValidation = fieldsValidation;
    this.onValueUpdate = onValueUpdate;
    this.styles = styles;
  }
  get props() {
    var props = {};
    for (const key of Object.keys(this)) {
      props[key] = this[key];
    }
    return props;
    //return {key:this.key, config:this.config, viewValues:this.viewValues, model:this.model, fieldValidation:this.fieldValidation, onValueUpdate:this.onValueUpdate, styles:this.styles };
  }
}
class FormlyComponentProps {
  constructor(config, viewValues, model, fieldsValidation, onValueUpdate, styles) {
    this.config = config;
    this.viewValues = viewValues;
    this.model = model;
    this.fieldsValidation = fieldsValidation;
    this.onValueUpdate = onValueUpdate;
    this.styles = styles;
  }

}



class PropsManipulator {

  static propsToField(formlyComponentProps) {
    let {config, viewValues, model, fieldsValidation, onValueUpdate, styles} = formlyComponentProps;

    var key = config.key || null;
    //only send the field validation as a prop instead of the fields validation
    var fieldValidation = fieldsValidation[config.key] || {};
    //evaluate the expression properties before sending the props to the field
    if (config.hasOwnProperty('expressionProperties'))
      this.evaluateExpressionProperties(config, viewValues, model);

    return new FieldProps(key, config, viewValues, model, fieldValidation, onValueUpdate, styles);
  }

  static propsToFieldGroup(formlyComponentProps) {
    let {config, viewValues, model, fieldsValidation, onValueUpdate, styles} = formlyComponentProps;

    var key = config.key || null;
    //send a the field group a isolated model if it needs one ... the same for viewValues
    if (config.key) model = model[config.key] ? model[config.key] : {};
    if (config.key) viewValues = viewValues[config.key] ? viewValues[config.key] : {};
    if (config.key) fieldsValidation = fieldsValidation[config.key] ? fieldsValidation[config.key] : {};

    return new FieldGroupProps(key, config, viewValues, model, fieldsValidation, onValueUpdate, styles);
  }


  static evaluateExpressionProperties(field, viewValues, model) {
    for (const key of Object.keys(field.expressionProperties)) {
      //note that key can be a dot separated path as (parent.child.property) so in order to set the
      //value of the key function setPropertyValue is used, which deals with nesting

      // note that field.key could be undefined
      let expressionContext = { "viewValue": viewValues[field.key], "modelValue": model[field.key], "model": model };
      Utils.setPropertyValue(field, key, FormlyExpressions.evaluate(field.expressionProperties[key], expressionContext));

    };

  }
}




export default class FieldsRenderer {

  //////////////////////////////////////////rendering functions//////////////////////////////////////////////////
  static renderField(FieldProps) {
    //config aliased to field makes config more readable
    let {config: field, viewValues, model} = FieldProps;

    var fieldComponent = field.component ? field.component : FieldsConfig.getTypeComponent(field.type);
    if (!fieldComponent) {
      throw new Error('Formly: "' + field.type + '" has not been added to FormlyConfig\'s field types.');
    }
    var propsFromConfig;
    if (field.props) {
      propsFromConfig = typeof field.props === 'function' ? field.props(model, field) : field.props;
    }

    //assign to variable to allow JSX compiler to pick up as a prop instead of string
    var FieldComponent = fieldComponent;
    var component = <FieldComponent  {...propsFromConfig} {...FieldProps.props}  />;
    return component;
  }

  static renderFieldGroup(FieldGroupProps) {
    return (
      <FieldGroup {...FieldGroupProps.props} />
    );
  }



  static generateFieldTag(FormlyComponentProps) {
    //config aliased to field makes config more readable
    let {config: field, viewValues, model} = FormlyComponentProps;
    var fieldComponent;

    if (this.shouldHide(field, viewValues, model)) {
      return null;
    }
    let convertedProps; // holds formlyComponentProps converted to FieldPorps or FiledGroupProps
    if (field.fieldGroup) {
      let FieldGroupProps = convertedProps = PropsManipulator.propsToFieldGroup(FormlyComponentProps);
      fieldComponent = this.renderFieldGroup(FieldGroupProps)
    }
    else {
      let FieldProps = convertedProps = PropsManipulator.propsToField(FormlyComponentProps);
      fieldComponent = this.renderField(FieldProps);
    }
    //return wrapped component
    return this.wrapComponent(field, fieldComponent, convertedProps);
  }



  //////////////////////////////////////////hide functions//////////////////////////////////////////////////
  static shouldHide(field, viewValues, model) {
    var hide = this.isOrInvoke(field, 'hideExpression', viewValues, model);
    return hide && hide !== null;
  }

  static isOrInvoke(field, property, viewValues, model) {
    if (!field.hasOwnProperty(property)) {
      return null;
    }
    else {
      // note that field.key could be undefined
      let expressionContext = { "viewValue": viewValues[field.key], "modelValue": model[field.key], "model": model };
      return FormlyExpressions.evaluate(field[property], expressionContext)
    }
  }

  //////////////////////////////////////////Wrapping functions//////////////////////////////////////////////////
  static wrapComponent(fieldObject, fieldComponent, componentProps) {
    //wrap component with the type wrappers 

    //wrap component with wrappers from the field config 
    var wrappers = this.getWrappers(fieldObject);

    wrappers.forEach(function (wrapper) {
      fieldComponent = this.wrapComponentWith(fieldComponent, wrapper, fieldObject, componentProps);
    }, this);
    return fieldComponent;

  }
  static getWrappers(fieldObject) {
    var wrappers = fieldObject.wrapper;
    // explicit null means no wrapper
    if (wrappers === null) {
      return [];
    }

    // nothing specified means use the default wrapper for the type
    if (!wrappers) {
      // get all wrappers that specify they apply to this type
      wrappers = Utils.arrayify(WrappersConfig.getWrappersComponentsByType(fieldObject.type));
    }
    else {
      wrappers = Utils.arrayify(wrappers).map(wrapperName => WrappersConfig.getWrapperComponent(wrapperName))
    }
    // get all wrappers for that the type specified that it uses.
    const type = FieldsConfig.getTypes()[fieldObject.type];
    if (type && type.wrapper) {
      const typeWrappers = Utils.arrayify(type.wrapper).map(wrapperName => WrappersConfig.getWrapperComponent(wrapperName))
      wrappers = wrappers.concat(typeWrappers);
    }


    // add the default wrapper last
    const defaultWrapper = WrappersConfig.getWrapperComponent();
    if (defaultWrapper) {
      wrappers.push(defaultWrapper)
    }
    return wrappers;
  }
  static wrapComponentWith(component, wrapperComponent, fieldObject, componentProps) {
    var WrapperComponent = wrapperComponent;
    if (!componentProps.key)
      delete componentProps.key;

    return <WrapperComponent {...componentProps}>{component}</WrapperComponent>
  }

}




module.exports.FormlyComponentProps = FormlyComponentProps;
