import 'jsdom-global/register';
import test from 'ava';
import simulant from 'simulant';
import html from './fixture';
import CsunTabs from '../';

const ACTIVE_CLASS = 'active';
const { document } = global.window;
global.document = document;

/**
 * Setup the fixture
 */
let tablist, tabs, panels;
const fixture = document.createElement('div');
document.body.appendChild(fixture);

test.beforeEach(() => {
  fixture.innerHTML = html;
  tablist = fixture.querySelector('[role="tablist"]')
  tabs = [...fixture.querySelectorAll('[role="tab"]')];
  panels = [...fixture.querySelectorAll('[role="tabpanel"]')];
  new CsunTabs(tablist, {
    activeClass: ACTIVE_CLASS
  });
});
// after each test clear out the fixture
test.afterEach(() => fixture.innerHTML = '');

/**
 * Attributes
 */

test('The element that serves as the container for the set of tabs has role tablist.', t => {
  t.is(tablist.getAttribute('role'), 'tablist');
});

test('Each element that serves as a tab has role tab and is contained within the element with role tablist.', t => {
  t.true(tabs.every(tab => tab.getAttribute('role') === 'tab'));
});

test('Each element that contains the content panel for a tab has role tabpanel.', t => {
  t.true(panels.every(panel => panel.getAttribute('role') === 'tabpanel'));
});

test('the tablist has an accessible label (aria-label or aria-labelledby)', t => {
  const ariaLabelledby = tablist.getAttribute('aria-labelledby');
  const labelledbyText = ariaLabelledby &&
    ariaLabelledby.split('')
      .map(id => document.getElementById(id).innerText)
      .join(' ');
  if (labelledbyText) {
    t.pass('has valid label');
    return;
  }

  const ariaLabel = tablist.getAttribute('aria-label');
  if (ariaLabel) {
    t.pass('has valid label');
    return;
  }

  t.fail();
});

test('Each element with role tab has the property aria-controls referring to its associated tabpanel element.', t => {
  const hasValidAriaControls = tab => {
    const panelId = tab.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    return panel && (panel.getAttribute('role') === 'tabpanel');
  };

  t.true(tabs.every(hasValidAriaControls));
});

test('The active tab element has the state aria-selected set to true and all other tab elements have it set to false.', t => {
  const ariaSelected = tab => tab.getAttribute('aria-selected');
  const [ tab1, tab2, tab3 ] = tabs;

  t.is(ariaSelected(tab1), 'true');
  t.is(ariaSelected(tab2), 'false');
  t.is(ariaSelected(tab3), 'false');
});

test('Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.', t => {
  t.true(panels.every(panel => {
    const tab = document.getElementById(panel.getAttribute('aria-labelledby'));
    return tab.getAttribute('role') === 'tab';
  }));
});

/**
 * Tab: When focus moves into the tab list, places focus on the active tab element . When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is typically either the first focusable element inside the tab panel or the tab panel itself.
 */

test('Sets tabIndex to 0 on the active tab and -1 to the rest', t => {
  const [ tab1, tab2, tab3 ] = tabs;

  t.is(tab1.tabIndex, 0);
  t.is(tab2.tabIndex, -1);
  t.is(tab3.tabIndex, -1);
});

/**
 * Keyboard
 */

test('Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.', t => {
  const [ tab1, tab2, tab3 ] = tabs;
  const arrowLeft = simulant('keydown', { key: 'ArrowLeft' });

  // "activate" tab1
  tab1.click();

  // fire arrow left on tab1
  simulant.fire(tab1, arrowLeft);
  t.is(document.activeElement, tab3);

  // activate tab2
  tab2.click();

  // fire arrow left on tab2
  simulant.fire(tab2, arrowLeft);
  t.is(document.activeElement, tab1);
});

test('Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.', t => {
  const [tab1, tab2, tab3] = tabs;
  const arrowRight = simulant('keydown', { key: 'ArrowRight' });

  // "activate" tab3
  tab3.click();

  // fire arrow right on tab3
  simulant.fire(tab3, arrowRight);
  t.is(document.activeElement, tab1);

  // activate tab2
  tab2.click();

  // fire arrow right on tab2
  simulant.fire(tab2, arrowRight);
  t.is(document.activeElement, tab3);
});

/**
 * Mouse
 */

test('Clicking a tab activates it (and displays panel)', t => {
  const [ tab1, tab2 ] = tabs;
  const [ panel1, panel2 ] = panels;

  tab2.click();
  t.true(panel2.classList.contains(ACTIVE_CLASS));
  t.false(panel1.classList.contains(ACTIVE_CLASS));
  t.is(tab2.tabIndex, 0);
  t.is(tab1.tabIndex, -1);

  tab1.click();
  t.true(panel1.classList.contains(ACTIVE_CLASS));
  t.false(panel2.classList.contains(ACTIVE_CLASS));
  t.is(tab1.tabIndex, 0);
  t.is(tab2.tabIndex, -1);
});
