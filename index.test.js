import simulant from 'simulant';
import axe from 'axe-core';
import html from './demo/fixture';
import CsunTabs from './';

const { document } = global.window;
global.document = document;

/**
 * Setup the fixture
 */
let tablist, tabs, panels;
const fixture = document.createElement('div');
document.body.appendChild(fixture);

// before each test set the fixture up
beforeEach(() => {
  fixture.innerHTML = html;
  tablist = fixture.querySelector('[role="tablist"]')
  tabs = [...fixture.querySelectorAll('[role="tab"]')];
  panels = [...fixture.querySelectorAll('[role="tabpanel"]')];
  new CsunTabs(tablist, {
    activeClass: 'active'
  });
});

// after each test clear out the fixture
afterEach(async () => {
  const { violations } = await axe.run(fixture);
  if (violations.length) {
    console.log(violations);
  }
  expect(violations.length).toBe(0);
  fixture.innerHTML = '';
});
