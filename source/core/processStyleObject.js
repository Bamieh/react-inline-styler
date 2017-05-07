const processorRunner = configs => 
  (styleObject, processor) => processor(styleObject, configs)

const processStyleObject = (styleObject, processingPipeline, configs)  => {
  const runProccessor = processorRunner(configs);

  return processingPipeline.reduce(runProccessor, styleObject)
}

export default processStyleObject