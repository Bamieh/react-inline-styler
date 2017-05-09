import {INLINE_STYLER_OBJECT_SIGNATURE} from '../constants'

const stampedPrototype = {
  toString() {
    return INLINE_STYLER_OBJECT_SIGNATURE
  }
}

export const isInlineStylerObject = (obj) => {
  return obj.toString() === INLINE_STYLER_OBJECT_SIGNATURE
}


export default function stampObjectProcessor(styleObject) {
  return Object.setPrototypeOf(styleObject, stampedPrototype);  
}

