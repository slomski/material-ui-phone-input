import * as React from 'react';
import * as metadata from 'libphonenumber-js/metadata.full.json';
import PhoneInput from '../src/PhoneInput';

export default class Example extends React.Component<{}> {
  state = {
    value: '+48501502503',
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  onValidationSuccess = (res: string) => {
    console.log(res);
  };

  onValidationFailed = (err: string) => {
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
        metadata={metadata}
      />
    );
  }
}
