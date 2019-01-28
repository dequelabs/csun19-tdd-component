import 'jsdom-global';
import test from 'ava';
import fixture from './fixture';
import csunTabs from '../';

/**
 * Setup the fixture
 */
let tablist, tabs, panels;
const fixure = document.createElement('div');
// Before each test runs we setup a "new"
// fixture and call csunTabs on the tablist
test.beforeEach(t => {
  fixture.innerHTML = fixture;
  tablist = fixture.querySelector('[role="tablist"]') 
  tabs = [...fixture.querySelectorAll('[role="tab"]')];
  panels = [...fixture.querySelectorAll('[role="tabpanel"]')];
  csunTabs(tablist);
});
// after each test clear out the fixture
test.afterEach(t => fixture.innerHTML = '');

/**
 * Tab: When focus moves into the tab list, places focus on the active tab element . When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is typically either the first focusable element inside the tab panel or the tab panel itself.
 * 
 * - this means we need to manage tabIndex (0 on the "active" tab and -1 on the rest)
 */
test('manages tab index');

/**
 * Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.
 * 
 * - circular!
 */
test('given a left arrow, focuses the previous tab');

/**
 * Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.
 * 
 * - circular!
 */
test('given a right arrow, focuses the next tab');

/**
 * The element that serves as the container for the set of tabs has role tablist.
 */
test('role=tablist is set on the container');

/**
 * Each element that serves as a tab has role tab and is contained within the element with role tablist.
 */
test('role=tab is set on each tab');

/**
 * If the tab list has a visible label, the element with role tablist has aria-labelledby set to a value that refers to the labeling element. Otherwise, the tablist element has a label provided by aria-label.
 * 
 * - check for aria-labelledby OR aria-label
 */
test('the tablist has an accessible label');

/**
 * Each element with role tab has the property aria-controls referring to its associated tabpanel element.
 */
test('each tab aria-controls it\'s panel');

/**
 * The active tab element has the state aria-selected set to true and all other tab elements have it set to false.
 */
test('aria-selected=true is set on the selected tab, while the others are false');

/**
 * Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.
 */
test('each panel is lablled by it\'s tab');
