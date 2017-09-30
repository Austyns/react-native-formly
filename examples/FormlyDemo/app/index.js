import React from 'react';
import { View } from 'react-native';
import { Formly } from 'react-native-formly';
//import CustomComponentForm from "./custom_component_example";
import MDTemplateForm from "./md_template_example";
//import ADVComponent from "./advanced_component_example";
var App = React.createClass({

    render: function () {
        return (
            <MDTemplateForm/>
        );
    }
});

module.exports = App;