// import * as React from 'react';
// import TextField from '@material-ui/core/TextField';
// import Autosuggest from 'react-autosuggest';
// import { ISuggestion } from './countries/types';

// type RenderInputComponent<TSuggestion> = (inputProps: InputProps<TSuggestion>) => React.ReactNode;

// export const renderInputComponent: React.SFC<Autosuggest.InputProps<ISuggestion>> = inputProps => {
//   const { classes, inputRef = () => {}, ref } = inputProps;

//   return (
//     <TextField
//       variant="filled"
//       fullWidth
//       InputProps={{
//         inputRef: node => {
//           ref(node);
//           inputRef(node);
//         },
//         classes: {
//           input: classes.input,
//         },
//       }}
//       // {...other}
//     />
//   );
// };
