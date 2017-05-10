import React, {Component} from 'react'
import {InlineStylerProvider} from '../../src';

const defaultProps = {
  initialConfigs: {},
}

class ProviderContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inlineStylerConfigurations: this.props.initialConfigs,
    };

  }
  render() {
    const {
      children,
      pipeline,
    } = this.props;
    const {
      inlineStylerConfigurations,
    } = this.state;

    return (
      <InlineStylerProvider configs={inlineStylerConfigurations} pipeline={pipeline}>
        { React.Children.only(children) }
      </InlineStylerProvider>
    )
  }
}

ProviderContainer.defaultProps = defaultProps;

export default ProviderContainer