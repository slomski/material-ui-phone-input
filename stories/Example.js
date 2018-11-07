import React from 'react';
import PhoneInput from '../src/PhoneInput';

export default class Example extends React.Component {
  state = {
    value: '+48536009544'
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return <PhoneInput defaultCountry="pl" value={value} onChange={this.handleChange} label="Phone input" />;
  }
}
