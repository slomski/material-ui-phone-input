import React from 'react';
import Autosuggest from 'react-autosuggest';
import MenuItem from '@material-ui/core/MenuItem';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { ISuggestion } from '../types';

export function renderSuggestion(
  suggestion: ISuggestion,
  { query, isHighlighted }: Autosuggest.RenderSuggestionParams
): React.ReactNode {
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
