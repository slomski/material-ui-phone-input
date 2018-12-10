import React from 'react';
import PhoneInput from '../src';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import examples from 'libphonenumber-js/examples.mobile.json';
import { getExampleNumber } from 'libphonenumber-js';
import Phone from '@material-ui/icons/Phone';

export default class Simple extends React.Component<{}> {
  state = {
    value: getExampleNumber('PL', examples).formatInternational(),
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Card elevation={1} style={{ maxWidth: '400px' }}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe">
              <Phone />
            </Avatar>
          }
          title="Material-UI Phone Input Component"
          subheader="Simple example, basic validation"
        />
        <CardContent>
          <PhoneInput
            defaultCountry="pl"
            value={value}
            onChange={this.handleChange}
            textFieldProps={{ label: 'Phone input', fullWidth: true }}
          />
        </CardContent>
      </Card>
    );
  }
}
