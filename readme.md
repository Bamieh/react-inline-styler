# React Inline Styler


##Getting started

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
const styles = ({theme, stylerHelpers}) => {
  const {
    colors,
  } = theme;

  const {
    onRTL,
    onlyRTL,
    onlyLTR,
  } = helpers;

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

# USING LOCALED STYLES IN JAVASCRIPT INLINE CSS
## Localization list
localizing styles happens on the key of the attibute, or its value.

### Localed Values
1. float
// float: start
// float: end

2. direction
// direction: start
// direction: end

3. transformOrigin
// transformOrigin: start
// transformOrigin: end

4. transform
// transform: translate
// transform: skew

### Localed Keys

1. margin
// marginStart
// marginEnd

2. padding
// paddingStart
// paddingEnd

3. position
// start
// end

4. border
// borderStart
// borderStartWidth
// borderStartStyle
// borderStartColor
// borderEnd
// borderEndWidth
// borderEndStyle
// borderEndColor

5. borderRadius
// borderTopStartRadius
// borderTopEndRadius
// borderBottomStartRadius
// borderBottomEndRadius


