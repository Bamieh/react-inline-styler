# Creating a custom styler

the `injectStyler` function expects an array of processors to be executed on each style, each processor is a function that accepts one argument, the style object, and returns a new proccessed style one.

Examples:

- react-inline-styler/autoprefixer
- react-inline-styler/rtl
- react-inline-styler/processOnce

- Docs simple example:
  This example will take 


## The customer styler funciton

To allow greater control over the styler, the styler function has an initializer function invoked when initializing the app,
which returns the function that will be called against each style object.

```
function initStyler(requiredExampleParam /*styler required params*/) {
  if(typeof requiredExampleParam === "undefined")
    return console.warn('requiredExampleParam is required'), null;

  return function stylerFunction(styleObject) {
    if(styleObject.fontSize) {
      return Object.assign({}, proccessedObject, {
        height: proccessedObject.height * requiredExampleParam,
      });.
    }
    return styleObject;
  }
}
```

## adding styler function to the flow
const myCustomStyler = import '../Path-To-Custom-Styler'
const isRTL = false;
const context = {
  ...injectStyler([
    ltrRtlStyler(isRTL),
    autoPrefixerStyler(),
    myCustomStyler(/*init functions required params*/),
  ])
}

## Guidelines

- returning null from the initializing function, will skip the styler processor.

