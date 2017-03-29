# React Inline Styler

React inline styler is a full solution for using inline styles in react. The library setup is similar to react redux by using a `Provider` component on the app level, and a HOC to wrap the components with to provide the proccessed styles.


## Getting started

```
npm install react-inline-styler
```

## Prelude

During the development of [Yamsafer website](https://www.yamsafer.com/en/) using react, our team tried almost every solution proposed by the community to style our components, but each had its shortcomings.

In late 2016 we migrated from Polymer to React (but thats for another story), we used to have a full powerful `SCSS` styles solution baked into our components, hence we used Airbnb's awesome library [react-with-styles](https://github.com/airbnb/react-with-styles) and in theory, this library was perfect for us, we used webpack to read scss files into our components, [classnames](https://github.com/JedWatson/classnames) for merging styles, and the setup was fairly easy by directly injecting their configurations into our application's context, soon we realized that directly playing with the context is a big no-no, as it is harder to maintain and adds more barrier to entry for new comers to react and the project. More importantly, the real issue was with overriding the styles from outside, this was not possible with sass styles as the overriding happens by the order of precedence in the scss files, instead of merging styles like that in javascript inline styles.

Based on the customization we needed to provide to components as props, we started looking for other solution using javascript styles. needless to say, some are very weird to implement with weird syntax that "just doesnt feel right", and some try to mimic writing styles in pure sass or css manner via javascript, which all by itself felt wrong to us aswell. some had huge performance dips, and mostly, non of them were easily configurable to enable us to add RTL support for arabic language and such, or add prefixes and other cool features.

And this is how *React Inline Styler* was born, it is a solution for scalable, optimized styles in javascript for React *Psst, React native very soon.

## Features

- Fully configurable: you can add a theme, helpers, processor configurations, etc.
- Super simple: the styles in javascript are just an object or a function.
- Super easy setup: the setup process is inspired from react-redux, the only thing you need to do is to add a `Provider` on the app level, and wrap your functions with an `injectStyles` HOC function.
- Plug-and-play solution to proccess the styles, adding RTL support, dynamic prefixing, and much more!
- Works with isomorphic apps and supports HOT reloads.
- Utilities to merge styles and proccess styles dynamically during the component life cycle.
- Modular way for using js inline styles in react instead of having them inside the render function or such.
- Continuously maintained, unit tested, and used in production on large scale apps.


## Example Usage

Check the example file for a full working example, that uses a custom processing pipeline, and configurations.

### Step 1: Wrapping the app with a Provider
Notice that you can have multiple providers nested inside each other within the app.


```javascript
import React, {Component} from 'react'
import ReactInlineStylerProvider from 'react-inline-styler'

class App extends Component {
  render() {
    return (
      <ReactInlineStylerProvider>
        App Content
      </ReactInlineStylerProvider>
    )
  }
} 
```

### Step 2: Injecting Proccessed styles to the Component

```javascript
import React, {Component} from 'react'
import injectStyles from 'react-inline-styler'
import stylesToInject from './styles'

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

export default injectStyles(stylesToInject)(MyComponent)
```

### Step 3: Configuring the Styler

#### Configurations and Theme
Full documentation is being prepared.

#### ProccessorPipeline

```
import rtlProccessor from 'react-inline-styler-processor-rtl'
```

Full documentation is being prepared.

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

## License

[MIT](blob/master/LICENSE). Copyright (c) 2017 Ahmad Bamieh

