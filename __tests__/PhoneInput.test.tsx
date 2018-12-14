import * as React from 'react';
import PhoneInput from '../src/PhoneInput/PhoneInput';
import * as renderer from 'react-test-renderer';

const handleChange = jest.fn();

it('PhoneInput no value renders correctly', () => {
  const tree = renderer.create(<PhoneInput value="" onChange={handleChange} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('PhoneInput with value renders correctly', () => {
  const tree = renderer.create(<PhoneInput value="+48501502503" onChange={handleChange} />).toJSON();
  expect(tree).toMatchSnapshot();
});
