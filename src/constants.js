//
export const PIPELINE = 'reactInlineStylerProcessorPipeline';
export const PIPELINE_PROP = 'pipeline';

export const CONFIGURATIONS = 'reactInlineStylerProcessorConfigurations';
export const CONFIGURATIONS_PROP = 'configs';


export const STYLE_PROCESSED = 'STYLE_PROCESSED';


export const INLINE_STYLER_OBJECT_SIGNATURE = '[object InlineStylerObject]';



// Errors
export const UNWRAPPED_INJECTOR_ERR = (componentDisplayName) => {
  return `Could not find "provided" in context ` +
  `of "${componentDisplayName}". ` +
  `Wrap a higher component in a <Provider>. `;
};