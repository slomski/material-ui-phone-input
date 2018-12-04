import * as React from 'react';
import { withStyles, StyledComponentProps, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import * as Autosuggest from 'react-autosuggest';
import { SuggestionsFetchRequestedParams } from 'react-autosuggest';
// import deburr from 'lodash/deburr';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Popper from '@material-ui/core/Popper';
import { PhoneNumber, CountryCode, CountryCallingCode, NationalNumber, Extension, NumberType } from 'libphonenumber-js';
import { parsePhoneNumber } from 'libphonenumber-js/custom';
import Fade from '@material-ui/core/Fade';
import errors from './errors';
import countries from './countries/index';
import FlagIcon from '../FlagIcon';
import { ISuggestion } from './countries/types';
// import { renderInputComponent } from './RenderInputComponent';

const suggestionsLists = countries.map(option => ({
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
  // console.log(country);
  const inputValue = country.trim().toLowerCase();
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

function renderInputComponent(inputProps: Autosuggest.InputProps<any>): React.ReactNode {
  const { classes, inputRef = () => {}, ref, onChange } = inputProps;
  // console.warn(other);
  // const onChange: (event: React.FormEvent<any>, params: Autosuggest.ChangeEvent) => void
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    // console.log(event.target.value);
    onChange(
      event as React.FormEvent<any>,
      { newValue: event.target.value, method: 'type' } as Autosuggest.ChangeEvent
    );
  };

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      onChange={handleChange}
    />
  );
}
function renderSuggestion(
  suggestion: ISuggestion,
  { query, isHighlighted }: Autosuggest.RenderSuggestionParams
): React.ReactNode {
  console.log('render suggestion');
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 400 }}>
              {part.text}
            </strong>
          )
        )}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion: ISuggestion): string {
  return suggestion.label;
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
  textFieldProps: TextFieldProps;
  validationType: NumberType[];
  onValidationSuccess: (res: string) => void;
  onValidationFailed: (res: string) => void;
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
      isPossible: true,
      isValid: true,
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

  parseNumber = (value: string): PhoneNumber | undefined => {
    const { metadata } = this.props;
    // console.log(metadata);
    try {
      // const numberInfo = parsePhoneNumber(value);
      const phoneNumber: PhoneNumber = parsePhoneNumber(value, metadata || null);
      // console.log(phoneNumber);
      // console.log(phoneNumber.getType());
      // delete phoneNumber.metadata;
      this.setState({ error: '', numberInfo: phoneNumber });
      return phoneNumber;
    } catch (error) {
      this.setState({ error: errors[`${error.message}`] });
      return;
    }
  };
  onSuggestionsFetchRequested = ({ value }: any) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
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

    console.log(this.state);

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
                    code={numberInfo.country ? numberInfo.country.toLowerCase() : defaultCountry.toLowerCase()}
                  />
                  <ArrowDropDown />
                </Button>
              </InputAdornment>
            ),
          }}
          {...textFieldProps}
        />
        <Popper open={isOpen} transition style={{ width: 'auto' }} anchorEl={anchorEl}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper elevation={1}>
                <Autosuggest
                  focusInputOnSuggestionClick={false}
                  {...autosuggestProps}
                  suggestions={suggestions}
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
                    <Paper square {...options.containerProps} elevation={1}>
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
