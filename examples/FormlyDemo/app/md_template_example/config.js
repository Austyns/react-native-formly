import { Formly, FormlyConfig } from 'react-native-formly';
let { FieldsConfig, MessagesConfig, ValidationsConfig } = FormlyConfig;

ValidationsConfig.addType({
  minlength: {
    expression: function ({ viewValue, modelValue, param }) {
      return !viewValue || (viewValue && viewValue.length >= param);
    },
    message: "'Minimum length is '+ param"
  }
});

MessagesConfig.addType([
  {
    name: 'required',
    message: "'This field is required!!!'"
  },
  {
    name: 'number',
    message: "viewValue+' is not a number'"
  },
  {
    name: 'maxlength',
    message: "'Maximum length is '+ param"
  }
]);