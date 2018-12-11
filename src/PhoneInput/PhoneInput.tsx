import React from 'react';
import { withStyles, StyledComponentProps, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import deburr from 'lodash/deburr';
import Popper from '@material-ui/core/Popper';
import { CountryCode, CountryCallingCode, NationalNumber, Extension, NumberType, PhoneNumber } from 'libphonenumber-js';
import { parsePhoneNumber } from 'libphonenumber-js/custom';
import metadata from 'libphonenumber-js/metadata.min.json';
import Fade from '@material-ui/core/Fade';
import countries from './countries';

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
  metadata: object;
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

function flagIcon(code: string): React.ReactNode {
  return <img src={require(`../flags/${code}.gif`)} />;
}

class PhoneInput extends React.Component<IPhoneNumberInfoProps, IPhoneInputState> {
  public static defaultProps: Partial<IPhoneNumberInfoProps> = {
    metadata: metadata,
  };
  popperNode: HTMLElement | null = null;
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
    if (value.length > 3) {
      const numberInfo = this.parseNumber(value);
      this.matchSuggestion(numberInfo);
    }
  };

  handleSuggestionsFetchRequested = (value: string) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  clearSuggestions = () => {
    this.setState({
      suggestions: [],
    });
  };

  matchSuggestion(numberInfo: IPhoneNumber | undefined): void {
    if (numberInfo && numberInfo.country) {
      const country = numberInfo.country.toLowerCase();
      const suggestion = suggestionsLists.find(e => e.value.toLocaleLowerCase() === country);
      this.setState({
        suggestion: suggestion ? suggestion.label : '',
      });
    }
  }

  // popperNode: React.Ref<any> | React.RefObject<any> | null = null;

  onSuggestionSelected = (event: React.SyntheticEvent, suggestion: string) => {
    const { onChange } = this.props;
    const { numberInfo } = this.state;
    const country = this.findCountryByName(suggestion);
    let newVal = '';
    if (country) {
      newVal = `${country.dialCode}`;
      if (numberInfo) {
        newVal += `${numberInfo.nationalNumber}`;
      }
      onChange(newVal);
      this.setState({ numberInfo: this.parseNumber(newVal), suggestion, suggestions: [] });
    }
  };

  handleSuggestionChange = (event: React.SyntheticEvent) => {
    const { value } = event.target as HTMLInputElement;
    this.setState({
      suggestion: value,
    });
    this.handleSuggestionsFetchRequested(value);
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
      phoneNumber = parsePhoneNumber(value, metadata);
      const { metadata: meta, ...rest } = phoneNumber;
      const response = {
        ...rest,
        type: phoneNumber.getType(),
        isValid: phoneNumber.isValid(),
        isPossible: phoneNumber.isPossible(),
      };
      if (validationType) {
        if (validationType.includes(phoneNumber.getType()) && phoneNumber.isValid()) {
          onValidationSuccess && onValidationSuccess(response);
          this.setState({ error: '', numberInfo: phoneNumber });
        } else {
          onValidationFailed && onValidationFailed(response);
          this.setState({ error: errors.INVALID_NUMBER, numberInfo: phoneNumber });
        }
      } else {
        phoneNumber = parsePhoneNumber(value, metadata);
        this.setState({ error: '', numberInfo: phoneNumber });
      }
      return phoneNumber;
    } catch (error) {
      this.setState({ error: errors[`${error.message}`] });
      return;
    }
  };

  findCountryByName = (name: string) => suggestionsLists.find(c => c.label.toLowerCase() === name.toLowerCase());

  handleSuggestionBlur = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { error, numberInfo, isOpen, suggestion, suggestions } = this.state;
    const { value, defaultCountry, textFieldProps } = this.props;
    // console.log(this.popperNode && this.popperNode.parent);
    const suggestionsToRender = suggestions.map((s: ISuggestion) => {
      return (
        <ListItem button onClick={e => this.onSuggestionSelected(e, s.label)}>
          <ListItemText primary={s.label} key={s.value} />
        </ListItem>
      );
    });
    return (
      <div
        ref={node => {
          this.popperNode = node;
        }}
      >
        <TextField
          onChange={this.handleInputChange}
          fullWidth
          value={value}
          error={Boolean(error)}
          helperText={Boolean(error) && error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Button size="small" style={{ paddingTop: 0, paddingBottom: 0 }} onClick={this.toggleOpen}>
                  {flagIcon(
                    numberInfo && numberInfo.country ? numberInfo.country.toLowerCase() : defaultCountry.toLowerCase()
                  )}
                  <ArrowDropDown />
                </Button>
              </InputAdornment>
            ),
          }}
          {...textFieldProps}
        />
        <Popper open={isOpen} transition disablePortal anchorEl={this.popperNode} placement="bottom-start">
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={1} style={{ width: this.popperNode ? this.popperNode.clientWidth : undefined }}>
                <Input
                  autoFocus
                  fullWidth
                  disableUnderline
                  style={{ padding: '5px 10px 0px 10px' }}
                  onBlur={this.handleSuggestionBlur}
                  onChange={this.handleSuggestionChange}
                  value={suggestion}
                />
                {suggestionsToRender && (
                  <div>
                    <Divider />
                    <List component="nav" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                      {suggestionsToRender}
                    </List>
                  </div>
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </div>
    );
  }
}
export default withStyles(styles)(PhoneInput);
