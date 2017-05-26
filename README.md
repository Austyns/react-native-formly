React-native-formly
===================

Build your forms easily by adding custom components, validations, error messages. 
This is a react-native implementation for [Angular Formly](https://github.com/formly-js/angular-formly). 
### Table of contents
* Installation
* Usage
	* Basic usage 
	* Create custom components
* Contribution
* Credits 

## Installation
```
npm install react-native-formly --save
```
## Usage
### Basic Usage
We are now working on our ready made components. Till then you can create your custom components, check the next section.
```js
import React from 'react';
import {ScrollView } from 'react-native';
import { Formly} from 'react-native-formly';

var FormlyApp = React.createClass({
      formlyConfig: {
        fields: [
            // add your form fields here
            {
                key: 'firstInput',
                type: 'textInput', //The custom component
                templateOptions: {
                    label:"First input label",
                    placeholder: "First input"
                }
            },
            {
                key: 'secondInput',
                type: 'textInput',
                templateOptions: {
                    placeholder: "Second input"
                },
                hideExpression: "model.firstInput==='hide'", //this hides the input when the first input value equals 'hide'
                validators: {
                    minlength: {
                        expression: function ({ viewValue, modelValue }) {
                            return !!viewValue && viewValue.length >= 4 ;
                        },
                        message: "'This should be longer than 4 letters'"
                    }
                },
            }
        ]
    },
    getInitialState: function () {
        return { model: {} }
    },
    _onFormlyUpdate: function (model) {
        this.setState({ model: model });
    },
    _onFormlyValidityChange: function (isValid) {
        this.setState({ formIsValid: isValid });
    },
    render: function () {
        return (
            <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
                <Formly config={this.formlyConfig} model={this.state.model} onFormlyUpdate={this._onFormlyUpdate} onFormlyValidityChange={this._onFormlyValidityChange} />
            </ScrollView>
        );
    }
});

```

### Create custom components
First you need to create react component and add `FieldMixin` to its `mixins`. The `FieldMixin` adds `onChange` function which you should call when the components value change.  Formly will automaticaly inject to your component the following props: **config**, **model**, **viewValues** and **fieldValidation**.  

`FormlyTextInput.js` 
```js
import React from 'react';
import { FieldMixin } from 'react-native-formly';
import {
    View,
    Text,
    TextInput
} from 'react-native';

var FormlyTextInput = React.createClass({
    mixins: [FieldMixin],
    render: function () {
        let key = this.props.config.key;
        let to = this.props.config.templateOptions || {};
        let model = this.props.model[key];
        let viewValue = this.props.viewValues[key];
        var fieldValidationResult = this.props.fieldValidation || {};
        let validationMessages = fieldValidationResult.messages || {}
        return (
            <View style={{ flex: 1 }}>
                <Text style={{fontWeight:"bold",color:"black"}}>{to.label}</Text>
                <TextInput editable={!to.disabled} underlineColorAndroid={fieldValidationResult.isValid ? "green" : "red"} value={model || viewValue} placeholder={to.placeholder} onChangeText={this.onChange} />
                <Text style={{ color: "red" }}>{Object.keys(validationMessages).length != 0 ? Object.values(validationMessages)[0] : null}</Text>
            </View>
        );
    }
});

module.exports = FormlyTextInput;
```
Now you only need to register your component with `Formly` before using it.

```js
import {Formly, FormlyConfig} from 'react-native-formly';
let {FieldsConfig} = FormlyConfig;

FieldsConfig.addType([
  { name: 'textInput', component: require('./FormlyTextInput') }
]);
```
#### **Working on the rest of the documentation...** 

### Contribution
Please check `CONTRIBUTING.md`.

### Credits
* Author - [Assem Hafez](https://github.com/Assem-Hafez)
* This library was built at [Codelabsys](http://www.codelabsys.com/)
* Special thanks for [Mohamed Abbas](https://github.com/Mohamed-Abbas) for helping out testing the library.
