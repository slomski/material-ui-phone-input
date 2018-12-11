import React from 'react';
import PhoneInput from '../src';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Phone from '@material-ui/icons/Phone';
import { numbersGenerator } from './NumbersGenerator';
import { IPhoneNumber } from '../src/PhoneInput/PhoneInput';

const gen: Iterator<IPhoneNumber> = numbersGenerator();
let number: IteratorResult<IPhoneNumber> = gen.next();
while (!number.value) {
  number = gen.next();
}

export default class Simple extends React.Component<{}> {
  state = {
    value: number.value.number,
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Card elevation={1} style={{ maxWidth: '600px' }}>
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
            value={value}
            onChange={this.handleChange}
            textFieldProps={{ label: 'Phone input', fullWidth: true }}
          />
        </CardContent>
      </Card>
    );
  }
}
