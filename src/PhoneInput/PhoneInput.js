import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Autosuggest from 'react-autosuggest';
import deburr from 'lodash/deburr';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Popper from '@material-ui/core/Popper';
import { parsePhoneNumber } from 'libphonenumber-js';
import Fade from '@material-ui/core/Fade';
import errors from './errors';
import countries from './countries';
import FlagIcon from '../FlagIcon';

const suggestionsLists = countries.map(option => ({
  value: option.code,
  label: option.name,
  dialCode: option.dialCode
}));

const styles = () => ({
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  input: {
    padding: 10,
    border: 0,
    width: '100%'
  }
});

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      variant="filled"
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
}

function getSuggestions(country) {
  const inputValue = deburr(country.trim()).toLowerCase();
  const inputLength = inputValue.length;
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

function renderSuggestion(suggestion, { query, isHighlighted }) {
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

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

class PhoneInput extends Component {
  state = {
    isOpen: false,
    suggestion: '',
    suggestions: [],
    error: '',
    numberInfo: {}
  };

  componentDidMount = () => {
    const { value } = this.props;
    if (value.length > 3) this.parseNumber(value);
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestionValue }) => {
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

  handleSuggestionChange = (event, { newValue }) => {
    this.setState({
      suggestion: newValue
    });
  };

  toggleOpen = event => {
    const { currentTarget } = event;
    this.setState(state => ({ anchorEl: currentTarget, isOpen: !state.isOpen }));
  };

  handleInputChange = event => {
    // console.log('handle input change');
    const { onChange } = this.props;
    const { value } = event.target;
    onChange(value);
    this.parseNumber(value);
  };

  parseNumber = value => {
    try {
      const { metadata, ...numberInfo } = parsePhoneNumber(value);
      this.setState({ error: '', numberInfo });
      return numberInfo;
    } catch (error) {
      this.setState({ error: errors[`${error.message}`] });
    }
  };

  findCountryByName = name => suggestionsLists.find(c => c.label.toLowerCase() === name.toLowerCase());

  render() {
    const { isOpen, suggestion, suggestions, anchorEl, error, numberInfo } = this.state;
    const { classes, label, value, defaultCountry, textFieldProps } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
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
                    code={numberInfo.country ? numberInfo.country.toLowerCase() : defaultCountry.toLowerCase()}
                  />
                  <ArrowDropDown />
                </Button>
              </InputAdornment>
            )
          }}
          {...textFieldProps}
        />
        <Popper open={isOpen} transition style={{ width: 'auto' }} anchorEl={anchorEl}>
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
                    inputRef: node => {
                      this.popperNode = node;
                    },
                    InputLabelProps: {
                      shrink: true
                    }
                  }}
                  theme={{
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion
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
