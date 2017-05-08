import React from 'react';

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import ProviderContainer from './fixtures/ProviderContainer'
import processStyleObject from '../src/core/processStyleObject'
import processStyleTree from '../src/core/processStyleTree'

import { redToBlueProcessor, addFontSize } from './fixtures/processors'

describe('Core', () => {
  const rootStyle = {color: 'red'};
  const stylesTree = {
    rootStyle: rootStyle,
    anotherStyle: {
      textAlign: 'right'
    },
    lastStyle: {
      color: 'red'
    }
  }

  const emptyPipeline = [];
  const emptyConfig = {};
  const redToBluePipeline = [redToBlueProcessor]; 
  const useConfigsPipeline = [redToBlueProcessor, addFontSize]; 
  const fontSizeConfigs = {fontSize: 14}

  describe('processStyleObject', () => {
    it('returns same object if pipeline is empty', () => {
      const processed = processStyleObject(rootStyle, emptyPipeline, emptyConfig);
      expect(processed).to.be.an('object');
      expect(processed).to.deep.equal(rootStyle);
    });
    it('executes the pipeline on the obejct', () => {
      const processed = processStyleObject(rootStyle, redToBluePipeline, emptyConfig);
      expect(processed).to.have.property('color').and.equal('blue');
    })
    it('sends configs to the pipline processors', () => {
      const processed = processStyleObject(rootStyle, useConfigsPipeline, fontSizeConfigs);
      expect(processed).to.have.property('fontSize').and.equal(14);

    })
  });

  describe('processStyleTree', () => {
    it('accepts an object as the styles object', () => {
      const processed = processStyleTree(stylesTree, emptyPipeline, emptyConfig)
      expect(processed).to.deep.equal(stylesTree);
    })
    it('accepts a function that returns a styles object', () => {
      const processed = processStyleTree(() => stylesTree, emptyPipeline, emptyConfig)
      expect(processed).to.deep.equal(stylesTree);
    })
    it('sends configs to the styleTree function', () => {
      const useConfigsStylesTree = configs => ({
        rootStyle: {
          fontSize: configs.fontSize,
        }
      })
      const processed = processStyleTree(useConfigsStylesTree, emptyPipeline, fontSizeConfigs)
      expect(processed).to.have.deep.property('rootStyle.fontSize').and.equal(14);
    })
    it('executes the pipeline on each style object in the tree', () => {
      const expectedStylesTree = {
        rootStyle: { color: 'blue' },
        anotherStyle: { textAlign: 'right' },
        lastStyle: { color: 'blue' }
      }

      const processed = processStyleTree(stylesTree, redToBluePipeline, emptyConfig);
      expect(processed).to.deep.equal(expectedStylesTree)
    })
  });

});



