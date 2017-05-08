import React, {Component} from 'react'
import {injectStyles} from '../../src';
import stylesToInject from './styles'

const defaultProps = {
  context: {
    isRTL : true,
  },
}

class InjectedComponent extends Component {
  render() {
    const {
      context,
      styles,
    } = this.props;

    return (
      <div>
        Hello world!
      </div>
    )
  }
}

InjectedComponent.defaultProps = defaultProps;
export default injectStyles(stylesToInject)(InjectedComponent)