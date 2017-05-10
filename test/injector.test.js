import React, { PropTypes, Component } from 'react';
import {
  renderIntoDocument,
  findRenderedComponentWithType,
  findRenderedDOMComponentWithTag,
} from 'react-addons-test-utils';


import { mount, shallow, render } from 'enzyme';


import ProviderContainer from './fixtures/ProviderContainer'
import InjectedComponent from './fixtures/InjectedComponent'

import injectStyles, {InlineStylerProvider} from '../src';

import stylesToInject from './fixtures/styles'
import {redToBlueProcessor} from './fixtures/processors'

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

  const mountInjector = (child, pipeline) => {
    return mount(
      <ProviderContainer initialConfigs={initialConfigs} pipeline={pipeline}>
        {child}
      </ProviderContainer>
    );
  }

  describe('Injector proccessStyle', () => {
    it('injects proccessStyle helper to wrapped component', () => {
        expect(child.props.computeStyle).to.be.a('function');
    });

    it('processes a style object', () => {
      function ProcessStylesChild({ style, processStyle }) {
        const processedRootStyle = processStyle(style)
        return <div style={processedRootStyle} />;
      }
      const InjectedChild = injectStyles({})(ProcessStylesChild);

      const styleToProccess = {color: "red"};
      const tree = mountInjector(<InjectedChild style={styleToProccess}/>, [redToBlueProcessor]);
      expect(tree).to.have.style("color", "blue")
    });
    it('processes a style object once', () => {
      function ProcessStylesChild({ style, processStyle }) {
        const processedRootStyle = processStyle(style)
        processedRootStyle.color = "red"
        const processedTwiceRootStyle = processStyle(processedRootStyle)

        return <div style={processedTwiceRootStyle} />;
      }
      const InjectedChild = injectStyles({})(ProcessStylesChild);

      const styleToProccess = {color: "red"};
      const tree = mountInjector(<InjectedChild style={styleToProccess}/>, [redToBlueProcessor]);
      expect(tree).to.have.style("color", "red")
      
    });
  })


  describe('Injector computeStyle', () => {

    function ComputedStylesChild({ styles, computeStyle, largeRoot }) {
      const computedRootStyle = computeStyle(styles.defaultRootStyle, {
        largeRootStyle: largeRoot
      })
      return <div style={computedRootStyle} />;
    }
    const InjectedChild = injectStyles(stylesToInject)(ComputedStylesChild);
    

    it('injects computeStyle helper to wrapped component', () => {
      expect(child.props.computeStyle).to.be.a('function');
    });
    it('computes multiple style objects', () => {
      const tree = mountInjector(<InjectedChild/>);
      expect(tree).to.have.style("position", "absolute")
      expect(tree).to.have.style("fontSize", "2rem")
    })
    it('computes style object if truthy', () => {
      const TRUEtree = mountInjector(<InjectedChild largeRoot={true}/>);
      const TRUTHYtree = mountInjector(<InjectedChild largeRoot={"A"}/>);
      expect(TRUEtree).to.have.style("position", "absolute")
      expect(TRUTHYtree).to.have.style("position", "absolute")

      expect(TRUEtree).to.have.style("fontSize", "4rem")
      expect(TRUTHYtree).to.have.style("fontSize", "4rem")
    })
    it('does not compute style object if falsey', () => {
      const FALSEtree = mountInjector(<InjectedChild largeRoot={false}/>);
      const FALSEYtree = mountInjector(<InjectedChild largeRoot={""}/>);
      expect(FALSEtree).to.have.style("position", "absolute")
      expect(FALSEYtree).to.have.style("position", "absolute")

      expect(FALSEtree).to.have.style("fontSize", "2rem")
      expect(FALSEYtree).to.have.style("fontSize", "2rem")
    })

  })


});