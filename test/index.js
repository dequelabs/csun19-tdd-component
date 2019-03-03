import 'jsdom-global/register';
import test from 'ava';
import simulant from 'simulant';
import isVisible from 'is-visible';
import html from './fixture';
import csunTabs from '../';

const { document } = global.window;

/**
 * Setup the fixture
 */
let tablist, tabs, panels;
const fixture = document.createElement('div');
// Before each test runs we setup a "new"
// fixture and call csunTabs on the tablist
test.beforeEach(() => {
  fixture.innerHTML = html;
  tablist = fixture.querySelector('[role="tablist"]')
  tabs = [...fixture.querySelectorAll('[role="tab"]')];
  panels = [...fixture.querySelectorAll('[role="tabpanel"]')];
  csunTabs(tablist);
});
// after each test clear out the fixture
test.afterEach(() => fixture.innerHTML = '');

/**
 * Tab: When focus moves into the tab list, places focus on the active tab element . When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is typically either the first focusable element inside the tab panel or the tab panel itself.
 *
 * - this means we need to manage tabIndex (0 on the "active" tab and -1 on the rest)
 */
test('manages tab index', t => {
  const [ tab1, tab2, tab3 ] = tabs;
  t.is(tab1.tabIndex, 0);
  t.is(tab2.tabIndex, -1);
  t.is(tab3.tabIndex, -1);
});

/**
 * Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.
 *
 * - circular!
 */
test('given a left arrow, focuses the previous tab', t => {
  const [ tab1, tab2, tab3 ] = tabs;
  const arrowLeft = simulant('keydown', { key: 'ArrowLeft' });
  simulant.fire(tab1, arrowLeft);
  t.is(document.activeElement, tab3);
  simulant.fire(tab3, arrowLeft);
  t.is(document.activeElement, tab2);
});

/**
 * Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.
 *
 * - circular!
 */
test('given a right arrow, focuses the next tab', t => {
  const [tab1, tab2, tab3] = tabs;
  const arrowRight = simulant('keydown', { key: 'ArrowRight' });
  simulant.fire(tab3, arrowRight);
  t.is(document.activeElement, tab1);
  simulant.fire(tab1, arrowRight);
  t.is(document.activeElement, tab2);
});

/**
 * The element that serves as the container for the set of tabs has role tablist.
 */
test('role=tablist is set on the container', t => {
  t.is(tablist.getAttribute('role'), 'tablist');
});

/**
 * Each element that serves as a tab has role tab and is contained within the element with role tablist.
 */
test('role=tab is set on each tab', t => {
  t.is(
    tabs.filter(t => t.getAttribute('role') === 'tab').length,
    3
  );
});

/**
 * If the tab list has a visible label, the element with role tablist has aria-labelledby set to a value that refers to the labeling element. Otherwise, the tablist element has a label provided by aria-label.
 *
 * - check for aria-labelledby OR aria-label
 */
test('the tablist has an accessible label', t => {
  const ariaLabel = tablist.getAttribute('aria-label');
  if (ariaLabel) {
    t.pass();
    return;
  }

  const labelledby = tablist.getAttribute('aria-label');
  const label = labelledby && document.getElementById(labelledby);
  if (label) {
    t.pass();
    return;
  }

  t.fail();
});

/**
 * Each element with role tab has the property aria-controls referring to its associated tabpanel element.
 */
test('each tab aria-controls it\'s panel', t => {
  tabs.forEach(tab => {
    const controlsID = tab.getAttribute('aria-controls');
    t.truthy(controlsID && document.getElementById(controlsID));
  });
});

/**
 * The active tab element has the state aria-selected set to true and all other tab elements have it set to false.
 */
test('aria-selected=true is set on the selected tab, while the others are false', t => {
  tabs[1].click();
  tabs.forEach((tab, index) => {
    t.is(tab.getAttribute('aria-selected'), index === 1 ? 'true' : 'false');
  });

  tabs[0].click();
  tabs.forEach((tab, index) => {
    t.is(tab.getAttribute('aria-selected'), index === 0 ? 'true' : 'false');
  });
});

/**
 * Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.
 */
test('each panel is labelled by it\'s tab', t => {
  const [ panel1, panel2, panel3 ] = panels;
  const [ tab1, tab2, tab3 ] = tabs;

  t.is(panel1.getAttribute('aria-labelledby'), tab1.id);
  t.is(panel2.getAttribute('aria-labelledby'), tab2.id);
  t.is(panel3.getAttribute('aria-labelledby'), tab3.id);
});

/**
 * Mouse users
 */
test('clicking tab displays its panel', t => {
  tabs[1].click();
  tabs.forEach((tab, index) => {
    t.is(isVisible(tab), index === 1);
  });

  tabs[0].click();
  tabs.forEach((tab, index) => {
    t.is(isVisible(tab), index === 0);
  });
});
