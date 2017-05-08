const getStyle = (styleEntry, styles) => {
  const styleKey = styleEntry[0], styleValue = styleEntry[1];
  return styleValue === true ? styles[styleKey] : {[styleKey]: styleValue};
}
const isTruthyStyle = (v) =>
  typeof v !== 'undefined' && v !== false && v !== null;

export const computeStyle = (...styles) => {
  return styles.reduce((styleObj, style) => {
    const computedStyle = Object.entries(style || {})
      .filter(([key, value]) => isTruthyStyle(value))
      .reduce((acc, truthyStyleEntry) => {
        const attributeObject = getStyle(truthyStyleEntry, this.styles);
        return Object.assign({}, acc, attributeObject)
      }, {})

      return Object.assign({}, styleObj, computedStyle)
  }, {})
}