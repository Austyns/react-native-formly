import React from 'react';
import { ScrollView } from 'react-native';
import { Formly } from 'react-native-formly';
import * as FormlyConfig from './config';

var CustomComponentForm = React.createClass({
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

module.exports = CustomComponentForm;