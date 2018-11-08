# material-ui-phone-input

Material UI input component for internationl phone number input

[You can find strorybook demo here](http://haystack.sh/material-ui-phone-input/)

## Usage

This component acepts following props:

| Property       |                      Desription                       |         Default value |
| -------------- | :---------------------------------------------------: | --------------------: |
| defaultCountry | country code to be displayed when no country detected |        none, required |
| value          |               value passed to the input               | empty string,optional |
| onChange       |           method called when input changes            |         none,required |
| textFieldProps |  props passed down to the MUI TextField componenent   |        none, optional |

## Dependencies

Component utilises [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) library for detecting countries and validating input.
