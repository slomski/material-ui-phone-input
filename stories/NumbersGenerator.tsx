import examples from 'libphonenumber-js/examples.mobile.json';
import { getExampleNumber, PhoneNumber, CountryCode } from 'libphonenumber-js';
import countries from '../src/PhoneInput/countries';

export function* numbersGenerator(): IterableIterator<PhoneNumber> {
  while (true) {
    let phoneNumber;
    try {
      phoneNumber = getExampleNumber(
        countries[Math.floor(Math.random() * countries.length)].code as CountryCode,
        examples
      );
      yield phoneNumber;
    } catch (error) {
      return null;
    }
  }
}
