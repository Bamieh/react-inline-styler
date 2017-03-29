import castToFunction from './utils/castToFunction';

const defaultHelpers = (isRTL) => {
  const onRTL = (rtlStyle, lrtStyle) => isRTL? rtlStyle : lrtStyle;
  return {
    onlyRTL: (rtl) => onRTL(rtl, null),
    onlyLTR: (lrt) => onRTL(null, ltr),
    onRTL,
  }
}

export const stylerContextInjector = (isRTL, {theme, helpers}={}) => {
  const castedHelpers = castToFunction(helpers);
  const castedTheme = castToFunction(theme);

  const stylerHelpers = Object.assign({},
    defaultHelpers(isRTL),
    castedHelpers(isRTL),
  )

  return {
    stylerHelpers,
    isRTL,
    theme: castedTheme(isRTL, helpers),
  }
}

