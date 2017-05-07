import castToFunction from '../utils/castToFunction'
import processStyleObject from './processStyleObject'
const processStyleTree = (stylesTree, processingPipeline, configs) => {
  const evaluatedStylesTree = castToFunction(stylesTree)(configs);
  if(!processingPipeline.length) return evaluatedStylesTree;

  return Object.entries(evaluatedStylesTree).reduce((acc, [styleName, styleObject]) => {
    return Object.assign(acc, {
      [styleName]: processStyleObject(styleObject, processingPipeline, configs),
    })
  }, {});
}

export default processStyleTree