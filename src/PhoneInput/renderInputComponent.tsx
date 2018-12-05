import React from 'react';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';

export function renderInputComponent(inputProps: Autosuggest.InputProps<any>): React.ReactNode {
  const { classes, inputRef = () => {}, ref, onChange, value, ...rest } = inputProps;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    onChange(
      event as React.FormEvent<any>,
      { newValue: event.target.value, method: 'type' } as Autosuggest.ChangeEvent
    );
  };

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
          input: classes.input,
        },
      }}
      {...rest}
      onChange={handleChange}
      defaultValue={value}
    />
  );
}
