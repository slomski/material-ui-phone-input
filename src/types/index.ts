import { PhoneNumber } from 'libphonenumber-js';

export interface ICountry {
  name: string;
  dialCode: string;
  code: string;
}

export interface ISuggestion {
  value: string;
  label: string;
  dialCode: string;
}

export enum errors {
  TOO_SHORT = 'Number is too short',
  TOO_LONG = 'Number is too long',
  INVALID_COUNTRY = 'Country code in number is invalid',
  NOT_A_NUMBER = 'Invalid number provided',
  INVALID_NUMBER = 'Number provided is not valid',
}

export interface IPhoneNumber extends PhoneNumber {
  metadata?: object;
}
