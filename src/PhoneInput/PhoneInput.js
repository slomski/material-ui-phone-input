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

const defaultValue = { value: 'PL', label: '', dialCode: '+48' };

function getSuggestions(country) {
  const inputValue = deburr(country.trim()).toLowerCase();
  // console.log(inputValue);
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
        {parts.map(
          (part, index) =>
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
    country: defaultValue.label,
    // popper: '',
    suggestions: []
  };

  // static getDerivedStateFromProps = (props, state) => {
  //   console.log(props);
  //   console.log(state);
  // };

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

  handleChange = name => (event, { newValue }) => {
    // console.log(newValue);
    this.setState({
      [name]: newValue
    });
  };

  toggleOpen = () => {
    this.setState(state => ({ isOpen: !state.isOpen }));
  };

  // onSelectChange = value => {
  //   this.toggleOpen();
  //   this.setState({ value });
  // };

  render() {
    const { isOpen, country, suggestions } = this.state;
    const { classes, label, value, defaultCountry } = this.props;
    const selectedCountry = suggestionsLists.find(c => c.label.toLowerCase() === country.toLowerCase());
    console.log(defaultCountry);
    console.log(value);
    console.log(selectedCountry);
    // const countryFromNumber =

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
          label={label}
          // value={selectedCountry ? selectedCountry.countryCode : defaultValue.countryCode}
          value={value}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Button size="small" style={{ paddingTop: 0, paddingBottom: 0 }} onClick={this.toggleOpen}>
                  <FlagIcon
                    code={selectedCountry ? selectedCountry.value.toLowerCase() : defaultValue.value.toLowerCase()}
                  />
                  <ArrowDropDown />
                </Button>
              </InputAdornment>
            )
          }}
        />

        <Popper open={isOpen} transition style={{ width: '100%' }}>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <Autosuggest
                  focusInputOnSuggestionClick={false}
                  {...autosuggestProps}
                  inputProps={{
                    classes,
                    placeholder: 'Type to search...',
                    value: country,
                    onChange: this.handleChange('country'),
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
                    <Paper square {...options.containerProps}>
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
