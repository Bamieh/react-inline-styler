import React, { Component, PropTypes } from 'react';

import {propTypes, contextTypes} from './injectorShape'

import shallowEqual from '../../utils/shallowEqual';
import isPlainObject from '../../utils/isPlainObject';

import invariant from 'invariant';

import {UNWRAPPED_INJECTOR_ERR, PIPELINE, CONFIGURATIONS} from '../../constants'

import castToFunction from '../../utils/castToFunction';

import processStyleObject from '../../core/processStyleObject'
import processStyleTree from '../../core/processStyleTree'
import stampObjectProcessor, {isInlineStylerObject} from '../../core/stampObject'

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

    class Inject extends Component {
      constructor(props, context) {
        super(props, context);
        this.version = version;

        const {
          [CONFIGURATIONS]: configs,
          [PIPELINE]: pipeline,
        } = context;

        invariant(
          configs,
          UNWRAPPED_INJECTOR_ERR(this.constructor.displayName)
        );

        // processingPipeline, configs
        this.state = { styles: processStyleTree(styleTree, pipeline, configs) };

        this.processStyle = this.processStyle.bind(this);
        this.computeStyle = this.computeStyle.bind(this);

      }
      computeStyle(...styles) {
        return stampObjectProcessor(styles.reduce((acc, style) => {
          if( !style || isInlineStylerObject(style) ) return Object.assign(acc, style);
          Object.entries(style).forEach(([styleKey, styleValue]) => {
            if(styleValue) {
              Object.assign(acc, this.state.styles[styleKey]);
            }
          })
          return acc;
        }, {}))
      }
      processStyle(styleObject) {
        if(!styleObject || isInlineStylerObject(styleObject)) return styleObject;

        const {
          [PIPELINE]: processingPipeline,
          [CONFIGURATIONS]: configs,
        } = this.context
        return processStyleObject(styleObject, processingPipeline, configs)
      }

      shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !shallowEqual(this.context[CONFIGURATIONS], nextContext[CONFIGURATIONS]) ||
                !shallowEqual(this.props, nextProps);
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const nextConfigs = nextContext[CONFIGURATIONS];
        if (!shallowEqual(this.context[CONFIGURATIONS], nextConfigs)) {
          const nextPipeline = nextContext[PIPELINE];
          this.forceUpdateStyle(nextPipeline, nextConfigs)
        }
      }

      forceUpdateStyle(pipeline, configs) {
        this.setState({
          styles: processStyleTree(styleTree, pipeline, configs)
        })
      }

      render() {

        return (
          <WrappedComponent
            {...this.props}
            styles={this.state.styles}
            computeStyle={this.computeStyle}
            processStyle={this.processStyle}
          />
        );
      }
    }

    if (nonProductionEnv) { // module.hot?
      Inject.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) return;
        this.version = version;
        this.forceUpdateStyle(this.context[PIPELINE], this.context[CONFIGURATIONS])
      };
    }

    Inject.displayName = displayName;
    Inject.WrappedComponent = WrappedComponent;
    Inject.contextTypes = contextTypes;

    return Inject;
  };
};

export default injector
