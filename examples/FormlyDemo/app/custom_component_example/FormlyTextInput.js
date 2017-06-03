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