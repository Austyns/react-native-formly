import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Formly } from 'react-native-formly';
require('react-native-formly-templates-md');
require('./config');

var MaterialForm = React.createClass({
    formlyConfig: {
        fields: [            // add your form fields here
            //Basic component            
            {
                key: 'firstInput',
                type: 'input', //material text input
                templateOptions: {
                    label: "Label",
                    placeholder: "Placeholder",
                    required: true,

                }
            },
            //component that hides on some condition
            {
                key: 'secondInput',
                type: 'input',
                templateOptions: {
                    placeholder: "Enter a number between 3 & 10 digits",
                    label: "Number Input",
                    type: "number",
                    minlength: 3,
                    maxlength: 10

                },
                hideExpression: "model.fourthInput==='hide'", //this hides the input when the fourth input value equals 'hide'
            },
            //component that controls its template option using expressionProperties
            {
                key: 'thirdInput',
                type: 'textarea',
                templateOptions: {
                    label: "Dynamic Label",
                    description: "Enter Value to change the label"

                },
                expressionProperties: {
                    "templateOptions.disabled": "model.fourthInput==='disable'", //this disables the input when the fourth input value equals 'disable'
                    "templateOptions.label": "viewValue || 'Dynamic Label'" //this changes the input when the label depending on the value
                }
            },
            //components with custom validator
            {
                key: 'fourthInput',
                type: 'input',
                templateOptions: {
                    label: "Custom Validation Input",
                    description: "Enter `hide` or `disable`"
                },
                validators: {
                    customValueValidator: {
                        expression: function ({ viewValue, modelValue, param }) {
                            //empty value or hide or disable
                            return !viewValue || viewValue == 'hide' || viewValue == 'disable';
                        },
                        message: "'Should equal to `hide` or `disable`'"
                    }
                }
            },
            {
                key: 'myMaterialSelect',
                type: 'select',
                templateOptions: {
                    label: "Select Input",
                    placeholder: "Select a type",
                    required: true,
                    description: "Select description",
                    options: [
                        "string",
                        2,
                        { name: "array", value: [1, 2, 3] },
                        { name: "date", value: new Date() },
                        { name: "object", value: { prop1: "value1" } }
                    ]

                }
            },
            {
                key: 'myMaterialRadio',
                type: 'radio',
                templateOptions: {
                    label: "Radio Input",
                    required: true,
                    description: "Select your type",
                    options: [
                        "string",
                        2,
                        { name: "array", value: [1, 2, 3] },
                        { name: "date", value: new Date() },
                        { name: "object", value: { prop1: "value1" } }
                    ]

                }
            }
        ]
    },
    getInitialState: function () {
        return { model: { secondInput: 2222222222222} }
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
                <Text style={{ backgroundColor: "#eee", borderRadius: 10, borderWidth: 1, borderColor: "transparent", padding: 10, margin: 10 }}>Model: {JSON.stringify(this.state.model, null, '\t')}</Text>
                <Formly config={this.formlyConfig} model={this.state.model} onFormlyUpdate={this._onFormlyUpdate} onFormlyValidityChange={this._onFormlyValidityChange} />
                <Text style={{ color: "white", backgroundColor: this.state.formIsValid ? "green" : "red", borderRadius: 10, borderWidth: 1, borderColor: "transparent", padding: 10, margin: 10, textAlign: "center", fontWeight: "bold" }}>Submit</Text>
            </ScrollView>
        );
    }
});

module.exports = MaterialForm;