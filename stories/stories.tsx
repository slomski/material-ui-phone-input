import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Example from './Example';

const stories = storiesOf('Phone Input', module);
stories.add('simple', () => <Example />);
