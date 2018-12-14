import * as countryNames from './countries-db.json';
import { ICountry } from './PhoneInput';
const countries: ICountry[] = [];

countryNames.forEach(country => {
  countries.push(country);
});
export default countries;
