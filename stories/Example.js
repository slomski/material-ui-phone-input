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
        defaultCountry="pl"
        value={value}
        onChange={this.handleChange}
        validationType={['FIXED_LINE_OR_MOBILE', 'PAGER']}
        onValidationSuccess={this.onValidationSuccess}
        onValidationFailed={this.onValidationFailed}
        textFieldProps={{ label: 'Phone input', fullWidth: true }}
        // metadata={metadata}
      />
    );
  }
}
