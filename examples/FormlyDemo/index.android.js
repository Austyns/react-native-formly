import React, { Component } from 'react';
import {
  AppRegistry,
  View
} from 'react-native';
import App from './app/index.js'
export default class FormlyDemo extends Component {
  render() {
    return (
     <App/>
    );
  }
}


AppRegistry.registerComponent('FormlyDemo', () => FormlyDemo);
