require('@babel/register')();
// import 'babel-polyfill';

process.env.NODE_ENV = 'test';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

var jsdom = require('jsdom').jsdom;
var entries = require('object.entries');


import chai from 'chai';
import chaiEnzyme from 'chai-enzyme';
import spies from 'chai-spies';

chai.use(chaiEnzyme());
chai.use(spies);

global.chai = chai;
global.expect = chai.expect;

if (!Object.entries) {
    entries.shim();
}

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};

