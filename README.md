# material-ui-phone-input

[![npm version](https://badge.fury.io/js/%40slomski%2Fmaterial-ui-phone-input.svg)](https://badge.fury.io/js/%40slomski%2Fmaterial-ui-phone-input)
[![Build Status](https://travis-ci.org/slomski/material-ui-phone-input.svg?branch=master)](https://travis-ci.org/slomski/material-ui-phone-input)[![Coverage Status](https://coveralls.io/repos/github/slomski/material-ui-phone-input/badge.svg?branch=master)](https://coveralls.io/github/slomski/material-ui-phone-input?branch=master)

Material UI input component for international phone number input

[You can find storybook demo here](https://slomski.github.io/material-ui-phone-input/)

## Usage

This component accepts following props:

| Property        |                     Desription                     | Default value |
| --------------- | :------------------------------------------------: | ------------: |
| value           |             value passed to the input              |  empty string |
| onChange        |          method called when input changes          |          none |
| textFieldProps? | props passed down to the MUI TextField componenent |          none |

## Dependencies

Component is using [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) library for detecting countries and validating input.
