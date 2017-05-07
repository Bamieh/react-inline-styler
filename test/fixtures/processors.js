export const redToBlueProcessor = style => {
  if(style.color === "red") {
    return Object.assign({}, style, {
      color: 'blue'
    })
  }
  return style
};

export const addFontSize = (style, configs) => {
  return Object.assign({}, style, {
    fontSize: configs.fontSize,
  })
}