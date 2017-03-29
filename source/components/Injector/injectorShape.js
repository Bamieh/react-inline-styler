import { PropTypes } from 'react';
import {CONFIGURATIONS, PIPELINE} from '../../constants';

const {
  // string,
  // bool,
  // number,
  array,
  // func,
  // oneOfType,
  object,
  // shape,
  // node,
  // symbol,
  // element,
  // objectOf,
  // instanceOf,
  // oneOf,
} = PropTypes;

export const propTypes = {};

export const contextTypes = {
  [CONFIGURATIONS]: object,
  [PIPELINE]: array,
};

