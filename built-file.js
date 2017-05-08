'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const getStyle = (styleEntry, styles) => {
  const styleKey = styleEntry[0],
        styleValue = styleEntry[1];
  return styleValue === true ? styles[styleKey] : { [styleKey]: styleValue };
};
const isTruthyStyle = v => typeof v !== 'undefined' && v !== false && v !== null;

const computeStyle = exports.computeStyle = (...styles) => {
  return styles.reduce((styleObj, style) => {
    const computedStyle = Object.entries(style || {}).filter(([key, value]) => isTruthyStyle(value)).reduce((acc, truthyStyleEntry) => {
      const attributeObject = getStyle(truthyStyleEntry, undefined.styles);
      return Object.assign({}, acc, attributeObject);
    }, {});

    return Object.assign({}, styleObj, computedStyle);
  }, {});
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _injectorShape = require('./injectorShape');

var _shallowEqual = require('../../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isPlainObject = require('../../utils/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _constants = require('../../constants');

var _castToFunction = require('../../utils/castToFunction');

var _castToFunction2 = _interopRequireDefault(_castToFunction);

var _processStyleObject = require('../../core/processStyleObject');

var _processStyleObject2 = _interopRequireDefault(_processStyleObject);

var _processStyleTree = require('../../core/processStyleTree');

var _processStyleTree2 = _interopRequireDefault(_processStyleTree);

var _stampObject = require('../../core/stampObject');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const nonProductionEnv = typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.NODE_ENV !== 'production';

let nextVersion = 0;
function injector(styleTree) {
  // invariant(
  //   styleTree,
  //   UNWRAPPED_INJECTOR_ERR(this.constructor.displayName)
  // );
  const version = nextVersion++;

  return function wrapWithInject(WrappedComponent) {
    const displayName = `inject(${getDisplayName(WrappedComponent)})`;

    class Inject extends _react.Component {
      constructor(props, context) {
        super(props, context);
        this.version = version;

        const configs = context[_constants.CONFIGURATIONS],
              pipeline = context[_constants.PIPELINE];


        (0, _invariant2.default)(configs, (0, _constants.UNWRAPPED_INJECTOR_ERR)(this.constructor.displayName));

        // processingPipeline, configs
        this.state = { styles: (0, _processStyleTree2.default)(styleTree, pipeline, configs) };

        this.processStyle = this.processStyle.bind(this);
        this.computeStyle = this.computeStyle.bind(this);
      }
      computeStyle(...styles) {
        return styles.reduce((acc, style) => {
          if (!style || (0, _stampObject.isInlineStylerObject)(style)) return Object.assign(acc, style);
          Object.entries(style).forEach(([styleKey, styleValue]) => {
            if (styleValue) {
              Object.assign(acc, this.state.styles[styleKey]);
            }
          });
          return acc;
        }, {});
      }
      processStyle(styleObject) {
        if (!styleObject || (0, _stampObject.isInlineStylerObject)(styleObject)) return styleObject;

        var _context = this.context;
        const processingPipeline = _context[_constants.PIPELINE],
              configs = _context[_constants.CONFIGURATIONS];

        return (0, _processStyleObject2.default)(styleObject, processingPipeline, configs);
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(0, _shallowEqual2.default)(this.context[_constants.CONFIGURATIONS], nextContext[_constants.CONFIGURATIONS]) || !(0, _shallowEqual2.default)(this.props, nextProps);
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const nextConfigs = nextContext[_constants.CONFIGURATIONS];
        if (!(0, _shallowEqual2.default)(this.context[_constants.CONFIGURATIONS], nextConfigs)) {
          const nextPipeline = nextContext[_constants.PIPELINE];
          this.forceUpdateStyle(nextPipeline, nextConfigs);
        }
      }

      forceUpdateStyle(pipeline, configs) {
        this.setState({
          styles: (0, _processStyleTree2.default)(styleTree, pipeline, configs)
        });
      }

      render() {

        return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
          styles: this.state.styles,
          computeStyle: this.computeStyle,
          processStyle: this.processStyle
        }));
      }
    }

    if (nonProductionEnv) {
      // module.hot?
      Inject.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) return;
        this.version = version;
        this.forceUpdateStyle(this.context[_constants.PIPELINE], this.context[_constants.CONFIGURATIONS]);
      };
    }

    Inject.displayName = displayName;
    Inject.WrappedComponent = WrappedComponent;
    Inject.contextTypes = _injectorShape.contextTypes;

    return Inject;
  };
};

exports.default = injector;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contextTypes = exports.propTypes = undefined;

var _react = require('react');

var _constants = require('../../constants');

const array = _react.PropTypes.array,
      object = _react.PropTypes.object;
const propTypes = exports.propTypes = {};

const contextTypes = exports.contextTypes = {
  [_constants.CONFIGURATIONS]: object,
  [_constants.PIPELINE]: array
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _shallowEqual = require('../../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _providerShape = require('./providerShape');

var _constants = require('../../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultProps = {
  [_constants.PIPELINE_PROP]: []
};

class Provider extends _react.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      configs: this.mergeFromPropsAndContext(props, context)
    };
    this.pipeline = [...this.props[_constants.PIPELINE_PROP]];
  }

  getChildContext() {
    return {
      [_constants.CONFIGURATIONS]: this.state.configs,
      [_constants.PIPELINE]: this.pipeline
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const nextConfigs = this.mergeFromPropsAndContext(nextProps, nextContext);
    if ((0, _shallowEqual2.default)(this.state.configs, nextConfigs)) {
      return;
    }
    this.setState({
      configs: nextConfigs
    });
  }

  mergeFromPropsAndContext(props, context) {
    return Object.assign({}, context[_constants.CONFIGURATIONS], props[_constants.CONFIGURATIONS_PROP]);
  }

  render() {
    return this.props.children;
  }
};

Provider.contextTypes = _providerShape.contextTypes;
Provider.childContextTypes = _providerShape.childContextTypes;
Provider.propTypes = _providerShape.propTypes;
Provider.defaultProps = defaultProps;

exports.default = Provider;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propTypes = exports.childContextTypes = exports.contextTypes = undefined;

var _react = require('react');

var _constants = require('../../constants');

const object = _react.PropTypes.object,
      element = _react.PropTypes.element,
      array = _react.PropTypes.array;
const contextTypes = exports.contextTypes = {
  [_constants.CONFIGURATIONS]: object,
  [_constants.PIPELINE]: array
};

const childContextTypes = exports.childContextTypes = {
  [_constants.CONFIGURATIONS]: object.isRequired,
  [_constants.PIPELINE]: array.isRequired
};

const propTypes = exports.propTypes = {
  children: element.isRequired,
  [_constants.CONFIGURATIONS_PROPS]: object,
  [_constants.PIPELINE_PROP]: array
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
//
const PIPELINE = exports.PIPELINE = 'reactInlineStylerProcessorPipeline';
const PIPELINE_PROP = exports.PIPELINE_PROP = 'pipeline';

const CONFIGURATIONS = exports.CONFIGURATIONS = 'reactInlineStylerProcessorConfigurations';
const CONFIGURATIONS_PROP = exports.CONFIGURATIONS_PROP = 'configs';

const STYLE_PROCESSED = exports.STYLE_PROCESSED = 'STYLE_PROCESSED';

const INLINE_STYLER_OBJECT_SIGNATURE = exports.INLINE_STYLER_OBJECT_SIGNATURE = '[object InlineStylerObject]';

// Errors
const UNWRAPPED_INJECTOR_ERR = exports.UNWRAPPED_INJECTOR_ERR = componentDisplayName => {
  return `Could not find "provided" in context ` + `of "${componentDisplayName}". ` + `Wrap a higher component in a <Provider>. `;
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const processorRunner = configs => (styleObject, processor) => processor(styleObject, configs);

const processStyleObject = (styleObject, processingPipeline, configs) => {
  const runProccessor = processorRunner(configs);
  return processingPipeline.reduce(runProccessor, styleObject);
};

exports.default = processStyleObject;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _castToFunction = require('../utils/castToFunction');

var _castToFunction2 = _interopRequireDefault(_castToFunction);

var _processStyleObject = require('./processStyleObject');

var _processStyleObject2 = _interopRequireDefault(_processStyleObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const processStyleTree = (stylesTree, processingPipeline, configs) => {
  const evaluatedStylesTree = (0, _castToFunction2.default)(stylesTree)(configs);
  if (!processingPipeline.length) return evaluatedStylesTree;

  return Object.entries(evaluatedStylesTree).reduce((acc, [styleName, styleObject]) => {
    return Object.assign(acc, {
      [styleName]: (0, _processStyleObject2.default)(styleObject, processingPipeline, configs)
    });
  }, {});
};

exports.default = processStyleTree;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInlineStylerObject = undefined;

var _constants = require('../constants');

const isInlineStylerObject = exports.isInlineStylerObject = obj => {
  return obj.toString() === _constants.INLINE_STYLER_OBJECT_SIGNATURE;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.injectStyles = undefined;

var _Injector = require('./components/Injector');

var _Injector2 = _interopRequireDefault(_Injector);

var _Provider = require('./components/Provider');

var _Provider2 = _interopRequireDefault(_Provider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.injectStyles = _Injector2.default;
exports.default = _Provider2.default;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const castToFunction = fn => typeof fn === 'function' ? fn : () => fn;
exports.default = castToFunction;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = hasEmptyIntersection;
function hasEmptyIntersection(objA, objB) {
  if (!objA || !objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) {
    return true;
  }

  if (objA === objB) {
    return false;
  }

  const objCombined = _extends({}, objA, objB);
  const keysCombined = Object.keys(objCombined);

  if (keysA.length + keysB.length === keysCombined.length) {
    return true;
  }

  return false;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPlainObject;
/**
 * copied from https://github.com/gaearon/react-redux/blob/master/src/utils/isPlainObject.js authored by @gaearon
 */

const fnToString = fn => Function.prototype.toString.call(fn);

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const proto = typeof obj.constructor === 'function' ? Object.getPrototypeOf(obj) : Object.prototype;

  if (proto === null) {
    return true;
  }

  const constructor = proto.constructor;

  return typeof constructor === 'function' && constructor instanceof constructor && fnToString(constructor) === fnToString(Object);
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowEqual;
/**
 * copied from https://github.com/gaearon/react-redux/blob/master/src/utils/isPlainObject.js authored by @gaearon
 */

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sharedKeys;
function sharedKeys(objA, objB) {

  if (!objA || !objB) {
    return [];
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) {
    return [];
  }

  if (objA === objB) {
    return keysA;
  }

  let sharedKeys = [];

  const hasOwn = Object.prototype.hasOwnProperty;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keysA[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      let keyA = _step.value;

      if (hasOwn.call(objB, keyA)) {
        sharedKeys.push(keyA);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return sharedKeys;
}
