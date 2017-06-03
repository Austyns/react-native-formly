import {Formly, FormlyConfig} from 'react-native-formly';
let {FieldsConfig,MessagesConfig,ValidationsConfig} = FormlyConfig;

ValidationsConfig.addType({
 minlength: {
    expression: function ({ viewValue, modelValue, param }) {
      return viewValue && viewValue.length >= param;
    },
    message:"'Minimum length is '+ param"
  }
});

MessagesConfig.addType([
  {
    name: 'required',
    message: "'This field is Required!!!'"
  },
  {
    name: 'number',
    message: "viewValue+' is not a number'"
  }
]);