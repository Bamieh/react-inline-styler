import React, {Component} from 'react'
import ReactInlineStylerProvider from 'react-inline-styler'

import rtlProcessor from 'react-inline-styler-processor-rtl'
import autopefixerProcessor from 'react-inline-styler-processor-autoprefixer'

const reactInlineStylerPipeline = [rtlProcessor, autopefixerProcessor];
import theme from './theme'

class App extends Component {
  render() {
    const configs = {
      // rtl processor configs and options
      isRTL: false,
      // autoprefixer options
      enablePrefixing: true,
      // theme
      theme: theme,
    }

    return (
      <ReactInlineStylerProvider
        configs={configs}
        pipeline={reactInlineStylerPipeline}
      >
        {this.props.children}
      </ReactInlineStylerProvider>
    )
  }
} 
