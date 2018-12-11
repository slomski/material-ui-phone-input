import React from 'react';
import metadata from 'libphonenumber-js/metadata.full.json';
import PhoneInput from '../src';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Phone from '@material-ui/icons/Phone';
import { numbersGenerator } from './NumbersGenerator';
import { IPhoneNumber } from '../src/PhoneInput/PhoneInput';

const gen: Iterator<IPhoneNumber> = numbersGenerator();
let number: IteratorResult<IPhoneNumber> = gen.next();
while (!number.value) {
  number = gen.next();
}

export default class Full extends React.Component<{}> {
  constructor(props: any) {
    super(props);
  }
  state = {
    value: number.value.number,
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  onValidationSuccess = (res: any) => {
    console.log(res);
  };

  onValidationFailed = (err: any) => {
    console.error(err);
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
          subheader="Full validation example"
        />
        <CardContent>
          <PhoneInput
            defaultCountry="pl"
            value={value}
            onChange={this.handleChange}
            validationType={['FIXED_LINE', 'MOBILE', 'PAGER']}
            onValidationSuccess={this.onValidationSuccess}
            onValidationFailed={this.onValidationFailed}
            textFieldProps={{ label: 'Phone input', fullWidth: true }}
            metadata={metadata}
          />
        </CardContent>
        <CardActions>
          <Typography color="textSecondary">Validation rules applied: 'FIXED_LINE', 'MOBILE', 'PAGER'</Typography>
        </CardActions>
      </Card>
    );
  }
}
