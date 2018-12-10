// no xk flag

import React from 'react';
import { withStyles, StyledComponentProps, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import Autosuggest from 'react-autosuggest';
import { SuggestionsFetchRequestedParams } from 'react-autosuggest';
import deburr from 'lodash/deburr';
import Popper from '@material-ui/core/Popper';
import {
  parsePhoneNumber,
  CountryCode,
  CountryCallingCode,
  NationalNumber,
  Extension,
  NumberType,
} from 'libphonenumber-js';
import { parsePhoneNumber as parsePhoneNumberCustom } from 'libphonenumber-js/custom';
import Fade from '@material-ui/core/Fade';
import countries from './countries';
import FlagIcon from '../FlagIcon';
import { ISuggestion, errors, IPhoneNumber } from '../types/index';
import { renderInputComponent } from './renderInputComponent';
import { renderSuggestion } from './renderSuggestion';

interface IPhoneInputNumberInfo {
  countryCallingCode: CountryCallingCode;
  country?: CountryCode;
  nationalNumber: NationalNumber;
  number: string;
  carrierCode?: string;
  ext?: Extension;
}

interface IPhoneInputState {
  isOpen: boolean;
  suggestion: string;
  suggestions: ISuggestion[];
  error: string;
  numberInfo: IPhoneInputNumberInfo | undefined;
  anchorEl: EventTarget & Element | null;
}

interface IPhoneNumberInfoProps extends StyledComponentProps {
  value: string;
  onChange: (value: string) => void;
  metadata?: object;
  defaultCountry: string;
  textFieldProps?: TextFieldProps;
  validationType?: NumberType[];
  onValidationSuccess?: (res: any) => void;
  onValidationFailed?: (res: any) => void;
}

const suggestionsLists: ISuggestion[] = countries.map(option => ({
  value: option.code,
  label: option.name,
  dialCode: option.dialCode,
}));

const styles = createStyles({
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  input: {
    padding: 10,
    border: 0,
    width: '100%',
  },
});

function getSuggestions(country: string) {
  const inputValue = deburr(country.trim()).toLowerCase();
  const inputLength = country.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestionsLists.filter(suggestion => {
        const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
        if (keep) {
          count += 1;
        }
        return keep;
      });
}

function getSuggestionValue(suggestion: ISuggestion): string {
  return suggestion.label;
}

class PhoneInput extends React.Component<IPhoneNumberInfoProps, IPhoneInputState> {
  state = {
    isOpen: false,
    suggestion: '',
    suggestions: [],
    error: '',
    anchorEl: null,
    numberInfo: {
      countryCallingCode: '',
      nationalNumber: '',
      number: '',
      country: 'pl' as CountryCode,
      phone: '',
      isPossible: false,
      isValid: false,
    },
  };

  componentDidMount = () => {
    const { value } = this.props;
    if (value.length > 3) this.parseNumber(value);
  };

  handleSuggestionsFetchRequested = ({ value }: SuggestionsFetchRequestedParams) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  popperNode: React.Ref<any> | React.RefObject<any> | null = null;

  onSuggestionSelected = (event: React.SyntheticEvent, { suggestionValue }: any) => {
    const { onChange } = this.props;
    const { numberInfo } = this.state;
    const country = this.findCountryByName(suggestionValue);
    let newVal = '';
    if (country) {
      newVal = `${country.dialCode}`;
      if (numberInfo) {
        newVal += `${numberInfo.nationalNumber}`;
      }
      onChange(newVal);
      this.setState({ numberInfo: this.parseNumber(newVal) });
    }
  };

  handleSuggestionChange = (event: React.SyntheticEvent, { newValue }: any) => {
    this.setState({
      suggestion: newValue,
    });
  };

  toggleOpen = (event: React.SyntheticEvent) => {
    const { currentTarget } = event;
    this.setState({ anchorEl: currentTarget, isOpen: !this.state.isOpen });
  };

  handleInputChange = (event: React.SyntheticEvent) => {
    const { onChange } = this.props;
    const { value } = event.target as HTMLInputElement;
    onChange(value);
    this.parseNumber(value);
  };

  parseNumber = (value: string): IPhoneNumber | undefined => {
    const { metadata, validationType, onValidationSuccess, onValidationFailed } = this.props;
    let phoneNumber: IPhoneNumber;
    try {
      if (metadata) {
        phoneNumber = parsePhoneNumberCustom(value, metadata);
        const { metadata: meta, ...rest } = phoneNumber;
        const response = {
          ...rest,
          type: phoneNumber.getType(),
          isValid: phoneNumber.isValid(),
          isPossible: phoneNumber.isPossible(),
        };
        if (validationType && validationType.includes(phoneNumber.getType()) && phoneNumber.isValid()) {
          onValidationSuccess && onValidationSuccess(response);
          this.setState({ error: '', numberInfo: phoneNumber });
        } else {
          onValidationFailed && onValidationFailed(response);
          this.setState({ error: errors.INVALID_NUMBER, numberInfo: phoneNumber });
        }
      } else {
        phoneNumber = parsePhoneNumber(value);
        this.setState({ error: '', numberInfo: phoneNumber });
      }
      return phoneNumber;
    } catch (error) {
      this.setState({ error: errors[`${error.message}`] });
      return;
    }
  };
  onSuggestionsFetchRequested = ({ value }: ISuggestion) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  findCountryByName = (name: string) => suggestionsLists.find(c => c.label.toLowerCase() === name.toLowerCase());

  render() {
    const { anchorEl, error, numberInfo, suggestions, isOpen, suggestion } = this.state;
    const { value, defaultCountry, textFieldProps, classes } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };
    return (
      <React.Fragment>
        <TextField
          onChange={this.handleInputChange}
          value={value}
          error={Boolean(error)}
          helperText={Boolean(error) && error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Button size="small" style={{ paddingTop: 0, paddingBottom: 0 }} onClick={this.toggleOpen}>
                  <FlagIcon
                    code={
                      numberInfo && numberInfo.country ? numberInfo.country.toLowerCase() : defaultCountry.toLowerCase()
                    }
                  />
                  <ArrowDropDown />
                </Button>
              </InputAdornment>
            ),
          }}
          {...textFieldProps}
        />
        <Popper open={isOpen} transition style={{ width: 'auto' }} anchorEl={anchorEl} placement="bottom-start">
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={1}>
                <Autosuggest
                  focusInputOnSuggestionClick={false}
                  onSuggestionSelected={this.onSuggestionSelected}
                  {...autosuggestProps}
                  inputProps={{
                    classes,
                    placeholder: 'Type to search...',
                    value: suggestion,
                    onChange: this.handleSuggestionChange,
                    onBlur: this.toggleOpen,
                    inputRef: (node: React.RefObject<any>) => {
                      this.popperNode = node;
                    },
                    InputLabelProps: {
                      shrink: true,
                    },
                  }}
                  theme={{
                    suggestionsList: classes ? classes.suggestionsList : '',
                    suggestion: classes ? classes.suggestion : '',
                  }}
                  renderSuggestionsContainer={options => (
                    <Paper square {...options.containerProps} elevation={0}>
                      {options.children}
                    </Paper>
                  )}
                />
              </Paper>
            </Fade>
          )}
        </Popper>
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(PhoneInput);
