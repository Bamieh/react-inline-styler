# React Inline Styler


## Getting started

```
npm install react-inline-styler
```


## Injecting to Component
```javascript
import React, {Component} from 'react'
import injectStyles from 'react-inline-styler'
import styles from './styles'

class MyComponent extends Component {
  render() {
    const {
      rootStyle,
    } = this.props.styles;

    return (
      <div style={rootStyle}>
        root Style
      </div>
    )
  }
}

export default injectStyles(styles)(MyComponent)
```

## Styles File
```javascript
const styles = (configs) => {
  const {
    colors,
  } = configs.theme;

  const {
    onRTL,
    onlyRTL,
    onlyLTR,
  } = configs.helpers;

  return {
    containerStyle: {
      color: onRTL('red', colors.secondary),
      backgroundColor: onlyRTL('red'),
      paddingStart: 10,
    },
    buttonStyle: {
      color: 'red',
      position: 'absolute',
      start: 10,
      marginTop: 10,
      marginEnd: 15,
    },
    activeButtonStyle: {
      color: colors.primary,
    },
  }
}

export default styles
```

