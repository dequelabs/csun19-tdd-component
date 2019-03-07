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

beforeEach(() => {
  fixture.innerHTML = html;
  tablist = fixture.querySelector('[role="tablist"]')
  tabs = [...fixture.querySelectorAll('[role="tab"]')];
  panels = [...fixture.querySelectorAll('[role="tabpanel"]')];
  new CsunTabs(tablist);
});
// after each test clear out the fixture
afterEach(async () => {
  const { violations } = await axe.run(fixture);
  expect(violations.length).toBe(0);
  fixture.innerHTML = '';
});

/**
 * Tab: When focus moves into the tab list, places focus on the active tab element . When the tab list contains the focus, moves focus to the next element in the page tab sequence outside the tablist, which is typically either the first focusable element inside the tab panel or the tab panel itself.
 *
 * - this means we need to manage tabIndex (0 on the "active" tab and -1 on the rest)
 */
test('manages tab index', () => {
  const [ tab1, tab2, tab3 ] = tabs;
  expect(tab1.tabIndex).toBe(0);
  expect(tab2.tabIndex).toBe(-1);
  expect(tab3.tabIndex).toBe(-1);
});

/**
 * Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.
 *
 * - circular!
 */
test('given a left arrow, focuses the previous tab', () => {
  const [ tab1, tab2, tab3 ] = tabs;
  const arrowLeft = simulant('keydown', { key: 'ArrowLeft' });
  tab1.click();
  simulant.fire(tab1, arrowLeft);
  expect(document.activeElement).toBe(tab3);
  tab3.click();
  simulant.fire(tab3, arrowLeft);
  expect(document.activeElement).toBe(tab2);
});

/**
 * Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.
 *
 * - circular!
 */
test('given a right arrow, focuses the next tab', () => {
  const [ tab1, tab2, tab3 ] = tabs;
  const arrowRight = simulant('keydown', { key: 'ArrowRight' });
  tab3.click();
  simulant.fire(tab3, arrowRight);
  expect(document.activeElement).toBe(tab1);
  tab1.click();
  simulant.fire(tab1, arrowRight);
  expect(document.activeElement).toBe(tab2);
});

/**
 * The element that serves as the container for the set of tabs has role tablist.
 */
test('role=tablist is set on the container', () => {
  expect(tablist.getAttribute('role')).toBe('tablist');
});

/**
 * Each element that serves as a tab has role tab and is contained within the element with role tablist.
 */
test('role=tab is set on each tab', () => {
  expect(tabs.filter(t => t.getAttribute('role') === 'tab').length)
    .toBe(3);
});

/**
 * Each element that contains the content panel for a tab has role tabpanel.
 */
test('role=tabpanel is set on each panel', () => {
  expect(panels.filter(p => p.getAttribute('role') === 'tabpanel').length)
    .toBe(3);
});

/**
 * If the tab list has a visible label, the element with role tablist has aria-labelledby set to a value that refers to the labeling element. Otherwise, the tablist element has a label provided by aria-label.
 *
 * - check for aria-labelledby OR aria-label
 */
test('the tablist has an accessible label', done => {
  const ariaLabel = tablist.getAttribute('aria-label');
  if (ariaLabel) {
    done();
    return;
  }

  const labelledby = tablist.getAttribute('aria-label');
  const label = labelledby && document.getElementById(labelledby);
  if (label) {
    done();
    return;
  }

  done.fail();
});

/**
 * Each element with role tab has the property aria-controls referring to its associated tabpanel element.
 */
test('each tab aria-controls it\'s panel', () => {
  tabs.forEach(tab => {
    const controlsID = tab.getAttribute('aria-controls');
    expect(controlsID && document.getElementById(controlsID)).toBeTruthy();
  });
});

/**
 * The active tab element has the state aria-selected set to true and all other tab elements have it set to false.
 */
test('aria-selected=true is set on the selected tab, while the others are false', () => {
  tabs[1].click();
  tabs.forEach((tab, index) => {
    expect(tab.getAttribute('aria-selected')).toBe(index === 1 ? 'true' : 'false');
  });

  tabs[0].click();
  tabs.forEach((tab, index) => {
    expect(tab.getAttribute('aria-selected')).toBe(index === 0 ? 'true' : 'false');
  });
});

/**
 * Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.
 */
test('each panel is labelled by it\'s tab', () => {
  const [ panel1, panel2, panel3 ] = panels;
  const [ tab1, tab2, tab3 ] = tabs;

  expect(panel1.getAttribute('aria-labelledby')).toBe(tab1.id);
  expect(panel2.getAttribute('aria-labelledby')).toBe(tab2.id);
  expect(panel3.getAttribute('aria-labelledby')).toBe(tab3.id);
});

/**
 * Mouse users
 */
test('clicking tab displays its panel', () => {
  tabs[1].click();
  tabs.forEach((tab, index) => {
    expect(panels[index].classList.contains('active')).toBe(index === 1);
  });

  tabs[0].click();
  tabs.forEach((tab, index) => {
    expect(panels[index].classList.contains('active')).toBe(index === 0);
  });
});
