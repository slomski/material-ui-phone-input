import React from 'react';
import metadata from 'libphonenumber-js/metadata.full.json';
import PhoneInput from '../src/PhoneInput';

export default class Example extends React.Component {
  state = {
    value: '+48501502503'
  };

  handleChange = value => {
    this.setState({ value });
  };

  onValidationSuccess = res => {
    console.log(res);
  };

  onValidationFailed = err => {
    console.log(err);
  };

  render() {
    const { value } = this.state;
    return (
      <PhoneInput
        defaultCountry="ex1"
        value={value}
        onChange={this.handleChange}
        validationType={['MOBILE', 'FIXED_LINE']}
        onValidationSuccess={this.onValidationSuccess}
        onValidationFailed={this.onValidationFailed}
        textFieldProps={{ label: 'Phone input', fullWidth: true }}
        metadata={metadata}
      />
    );
  }
}
