import React, { PropTypes, Component } from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag,
} from 'react-addons-test-utils';


import { mount, shallow, render } from 'enzyme';
import chai from 'chai';
import spies from 'chai-spies';

chai.use(spies);
const expect = chai.expect;

import ProviderContainer from './fixtures/ProviderContainer'
import InjectedComponent from './fixtures/InjectedComponent'

import {injectStyles} from '../src';
import InlineStylerProvider from '../src';

import stylesToInject from './fixtures/styles'

import {
  UNWRAPPED_INJECTOR_ERR,
  PIPELINE,
  PIPELINE_PROP,
  CONFIGURATIONS,
  CONFIGURATIONS_PROP,
} from '../src/constants'

describe('Injector HOC', () => {
    class Foil extends Component {
      render() {
        return this.props.children;
      }
    }

    class Child extends Component {
      static contextTypes = {
        [CONFIGURATIONS]: PropTypes.object.isRequired
      }

      render() {
        return <Foil {...this.props}><div>{this.props.children}</div></Foil>;
      }
    }



  const InjectedChild = injectStyles(stylesToInject)(Child);

  const tree = renderIntoDocument(
    <InlineStylerProvider configs={{isRTL: false}}>
      <InjectedChild />
    </InlineStylerProvider>
  );
  const child = findRenderedComponentWithType(tree, Foil);

  it('throws if Provider is not wrapping a higher component of the invoked Injector', () => {
    const expectedErrorMessage = UNWRAPPED_INJECTOR_ERR(InjectedComponent.displayName)
    let error = null;
    try {
      const wrapper = shallow(<InjectedComponent />);
    } catch(e) {
      error = e;
    }
    expect(error).to.not.equal(null);
    expect(error.message).to.equal(expectedErrorMessage);
  });
  
  it('injects styles prop to wrapped component', () => {
      expect(child.props.styles).to.be.an('object');
  });
  it('injects computeStyle helper to wrapped component', () => {
      expect(child.props.computeStyle).to.be.a('function');
  });
  it('injects proccessStyle helper to wrapped component', () => {
      expect(child.props.computeStyle).to.be.a('function');
  });
  
  const initialConfigs = {isRTL: true};
  const differentConfigs = {isRTL: false};

  it('updates Styles when provider configurations change', () => {
      const spy = chai.spy( _ => {} );

      function SpiedChild({ styles }) {
        spy();
        return <div style={{color: 'red'}} data-styles={styles} />;
      }
      
      const InjectedChild = injectStyles(stylesToInject)(SpiedChild);

      const tree = renderIntoDocument(
        <ProviderContainer initialConfigs={initialConfigs}>
          <InjectedChild />
        </ProviderContainer>
      );

      const child = findRenderedDOMComponentWithTag(tree, 'div');
      expect(spy).to.have.been.called.exactly(1);
      tree.setState({
        inlineStylerConfigurations: differentConfigs
      });
      expect(spy).to.have.been.called.exactly(2);
  });
  it.skip('propagates update through `shouldComponentUpdate => false` higher components', () => {

  });
  it('does not update Styles when provider configurations do not change', () => {
    const spy = chai.spy( _ => {} );

    function SpiedChild({ styles }) {
      spy();
      return <div style={{color: 'red'}} data-styles={styles} />;
    }
    const InjectedChild = injectStyles(stylesToInject)(SpiedChild);
    
    const tree = renderIntoDocument(
      <ProviderContainer initialConfigs={initialConfigs}>
        <InjectedChild />
      </ProviderContainer>
    );

    const child = findRenderedDOMComponentWithTag(tree, 'div');
    expect(spy).to.have.been.called.exactly(1);
    tree.setState({inlineStylerConfigurations: initialConfigs});
    expect(spy).to.have.been.called.exactly(1);
  });


});