React-native-formly
===================

Build your forms easily by adding custom components, validations, error messages. 
###Table of contents
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
##Usage
###Basic Usage
We are now working on our ready made components. Till then you can create your custom components, check the next section.
```js
import React from 'react';
import {ScrollView } from 'react-native';
import { Formly} from 'react-native-formly';

var FormlyApp = React.createClass({
     formlyConfig: {
        name: "",
        // add your form fields here
        fields: [
            {
                key: 'firstInput',
                type: 'textInput', //The custom component
                templateOptions: {
                    placeholder: "first input"
                }
            },
            {
                key: 'secondInput',
                type: 'textInput',//The custom component
                templateOptions: {
                    placeholder: "second input"
                },
                hideExpression: "model.firstInput==='hide'", //this hides the input when the first input value equals 'hide'
                validators: {
                    maxlength: {
                        expression: function ({ viewValue, modelValue, param }) {
                            return viewValue.length <= param;
                        },
                        message: "'This should be shorter'"
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
                <Formly config={this.props.config} model={this.state.model} onFormlyUpdate={this._onFormlyUpdate} onFormlyValidityChange={this._onFormlyValidityChange} />
            </ScrollView>
        );
    }
});

```

###Create custom components
First you need to create react component and add `FieldMixin` to its `mixins`. The `FieldMixin` adds `onChange` function which you should call when the components value change.  Formly will automaticaly inject to your component the following props: **config**, **model** and **viewValues**.  

`FormlyTextInput.js` 
```js
import { FieldMixin } from 'react-native-formly';
import {
  View,
  Text,
  TextInput
} from 'react-native';

var FormlyTextArea = React.createClass({
  mixins: [FieldMixin],
  render: function () {
    let key = this.props.config.key;
    let to = this.props.config.templateOptions || {};
    let model = this.props.model[key];
    let viewValue = this.props.viewValues[key];
    return (
      <View style={{ flex: 1}}>
        <TextInput editable={!to.disabled} value={model || viewValue} placeholder={to.placeholder} onChangeText={this.onChange} />
      </View>
    );
  }
});

module.exports = FormlyTextArea;
```
Now you only need to register your component with `Formly` before using it.

```js
import {Formly, FormlyConfig} from 'react-native-formly';
let {FieldsConfig} = FormlyConfig;

FieldsConfig.addType([
  { name: 'input', component: require('./FormlyTextInput') }
]);
```
####**Working on the rest of the documentation...** 

###Contribution
Please check `CONTRIBUTING.md`.

###Credits
* Author - [Assem Hafez](https://github.com/Assem-Hafez)
* This library was build at [Codelabsys](http://www.codelabsys.com/)
* Special thanks for [Mohamed Abbas](https://github.com/Mohamed-Abbas) for his help in testing the library.
