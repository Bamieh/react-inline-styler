import PropTypes from 'prop-types';
import {
  PIPELINE,
  PIPELINE_PROP,
  CONFIGURATIONS,
  CONFIGURATIONS_PROPS,
} from '../../constants';

const {
  object,
  element,
  array,
} = PropTypes;


export const contextTypes = {
  [CONFIGURATIONS]: object,
  [PIPELINE]: array,
};

export const childContextTypes = {
  [CONFIGURATIONS]: object.isRequired,
  [PIPELINE]: array.isRequired,
};

export const propTypes = {
  children: element.isRequired,
  [CONFIGURATIONS_PROPS]: object,
  [PIPELINE_PROP]: array,
};