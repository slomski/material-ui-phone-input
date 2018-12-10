import countryNames from './countries';
import { ICountry } from './PhoneInput';
const countries: ICountry[] = [];

countryNames.forEach(country => {
  countries.push(country);
});

export default countries;
