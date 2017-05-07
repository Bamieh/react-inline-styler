import React from 'react';

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import ProviderContainer from './fixtures/ProviderContainer'
import {processStyleObject} from '../source/core/processStyleObject'

describe('Core', () => {
  describe('processStyleObject', () => {
    it('returns same object if pipeline is empty', () => {
      const style = {color: 'red'};
      const processed = processStyleObject(style, []);
      expect(processed).to.be.an('object');
      expect(processed).to.deep.equal(style);
    });
  });
});