import React, {Component} from 'react'
import injectStyles from 'react-inline-styler'
import stylesToInject from './styles'

class StyledComponent extends Component {
  render() {
    const {
      rootStyle,
    } = this.props.styles;

    return (
      <div style={rootStyle}>
        Hello world!
      </div>
    )
  }
}

export default injectStyles(stylesToInject)(StyledComponent)