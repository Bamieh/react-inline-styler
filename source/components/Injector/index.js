import React, { Component, PropTypes } from 'react';

import {propTypes, contextTypes} from './injectorShape'

import shallowEqual from '../../utils/shallowEqual';
import isPlainObject from '../../utils/isPlainObject';

import invariant from 'invariant';

import {UNWRAPPED_INJECTOR_ERR, PIPELINE, CONFIGURATIONS} from '../../constants'

import castToFunction from '../../utils/castToFunction';

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

const nonProductionEnv = typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.NODE_ENV !== 'production';

let nextVersion = 0;
function injector(styleTree) {
  const version = nextVersion++;

  return function wrapWithInject(WrappedComponent) {
    const displayName = `inject(${getDisplayName(WrappedComponent)})`;

    class Inject extends Component {
      constructor(props, context) {
        super(props, context);
        this.version = version;
        this[CONFIGURATIONS] = context[CONFIGURATIONS];

        invariant(
          this[CONFIGURATIONS],
          UNWRAPPED_INJECTOR_ERR(this.constructor.displayName)
        );

        this.state = {
          styles: this.processStyleTree(styleTree, this[CONFIGURATIONS]),
        };

        this.processStyle = this.processStyle.bind(this);
        this.computeStyle = this.computeStyle.bind(this);

      }
      computeStyle() {

      }
      processStyle(styleObject, configs=this.context[CONFIGURATIONS]) {
        if(!styleObject || !Object.keys(obj).length) return;
        const {
          [PIPELINE]: processingPipeline,
        } = this.context;

        return processingPipeline.reduce((acc, processor) => {
          return processor(styleObject, configs)
        }, {})
      }

      processStyleTree(stylesTree, configs) {
        const {
          [PIPELINE]: processingPipeline,
        } = this.context;

        const evaluatedStylesTree = castToFunction(stylesTree)(configs);
        if(!processingPipeline.length) return evaluatedStylesTree;

        return Object.entries(evaluatedStylesTree).reduce((acc, [styleName, styleObject]) => {
          return Object.assign(acc, {
            [styleName]: this.processStyle(processingPipeline, configs, styleObject),
          })
        }, {});
      }


      shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !shallowEqual(this[CONFIGURATIONS], nextContext[CONFIGURATIONS]) ||
                !shallowEqual(this.props, nextProps);
      }

      componentWillReceiveProps(nextProps, nextContext) {
        const nextConfigs = nextContext[CONFIGURATIONS];
        if (!shallowEqual(this[CONFIGURATIONS], nextConfigs)) {
          this.recomputeProvided(nextConfigs);
        }
      }

      recomputeProvided(newConfigs) {
        this.setState({
          styles: this.processStyleTree(styleTree, newConfigs),
        });
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

    if (nonProductionEnv){
      Inject.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.version === version) return;
        this.version = version;
        this.recomputeProvided(this.context[CONFIGURATIONS]);
      };
    }

    Inject.displayName = displayName;
    Inject.WrappedComponent = WrappedComponent;
    Inject.contextTypes = contextTypes;

    return Inject;
  };
};

export default injector
