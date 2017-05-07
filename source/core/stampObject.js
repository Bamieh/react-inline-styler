import {INLINE_STYLER_OBJECT_SIGNATURE} from '../constants'

export const isInlineStylerObject = (obj) => {
  return obj.toString() === INLINE_STYLER_OBJECT_SIGNATURE
}

