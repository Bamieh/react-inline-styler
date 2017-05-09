import React, { Component } from 'react';
import shallowEqual from '../../utils/shallowEqual';
import stampObjectProcessor from '../../core/stampObject'
import {contextTypes, childContextTypes, propTypes} from './providerShape'

import {
  PIPELINE,
  PIPELINE_PROP,
  CONFIGURATIONS,
  CONFIGURATIONS_PROP,
} from '../../constants';

const defaultProps = {
  [PIPELINE_PROP]: [],
}

class Provider extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      configs: this.mergeFromPropsAndContext(props, context),
    };
    this.pipeline = [...this.props[PIPELINE_PROP], stampObjectProcessor];
  }

  getChildContext() {
    return {
      [CONFIGURATIONS]: this.state.configs,
      [PIPELINE]: this.pipeline,
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const nextConfigs = this.mergeFromPropsAndContext(nextProps, nextContext);
    if (shallowEqual(this.state.configs, nextConfigs)) {
      return;
    }
    this.setState({
      configs: nextConfigs,
    });
  }

  mergeFromPropsAndContext(props, context) {
    return Object.assign({}, context[CONFIGURATIONS], props[CONFIGURATIONS_PROP]);
  }

  render() {
    return this.props.children;
  }
};

Provider.contextTypes = contextTypes;
Provider.childContextTypes = childContextTypes;
Provider.propTypes = propTypes;
Provider.defaultProps = defaultProps;

export default Provider
