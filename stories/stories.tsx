import React from 'react';
import { storiesOf } from '@storybook/react';
import Simple from './Simple';
import Full from './FullValidation';

const stories = storiesOf('Phone Input', module);
stories.add('Simple example', () => <Simple />);
stories.add('Full validation example', () => <Full />);
