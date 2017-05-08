const castToFunction = fn => typeof fn === 'function'? fn : () => fn;
export default castToFunction
