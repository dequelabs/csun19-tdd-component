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

test('sets tabIndex to 0 on the active tab and -1 on the rest', () => {
  const [ tab1, tab2, tab3 ] = tabs;
  // activate the first tab
  tab1.click();
  expect(tab1.tabIndex).toBe(0);
  expect(tab2.tabIndex).toBe(-1);
  expect(tab3.tabIndex).toBe(-1);

  tab2.click();
  expect(tab1.tabIndex).toBe(-1);
  expect(tab2.tabIndex).toBe(0);
  expect(tab3.tabIndex).toBe(-1);
});

test('Left Arrow: moves focus to the previous tab. If focus is on the first tab, moves focus to the last tab.', () => {
  const leftArrow = simulant('keydown', { key: 'ArrowLeft' });
  const [tab1, tab2, tab3] = tabs;
  tab1.click();
  // fire a left arrow on the first tab
  simulant.fire(tab1, leftArrow);
  // from first to last
  expect(document.activeElement).toBe(tab3);

  tab2.click();
  simulant.fire(tab2, leftArrow);
  expect(document.activeElement).toBe(tab1);
});

test('Right Arrow: Moves focus to the next tab. If focus is on the last tab element, moves focus to the first tab.', () => {
  const rightArrow = simulant('keydown', { key: 'ArrowRight' });
  const [tab1, tab2, tab3] = tabs;
  tab3.click();

  simulant.fire(tab3, rightArrow);
  // from last to first
  expect(document.activeElement).toBe(tab1);

  tab2.click();
  simulant.fire(tab2, rightArrow);
  expect(document.activeElement).toBe(tab3);
});

test('clicking a tab activates it and displays its panel', () => {
  const isActive = (tab, panel) => {
    return tab.tabIndex === 0 && panel.classList.contains('active');
  }
  const [tab1, tab2, tab3] = tabs;
  const [ panel1, panel2, panel3 ] = panels;

  tab1.click();
  expect(isActive(tab1, panel1)).toBe(true);
  expect(isActive(tab2, panel2)).toBe(false);
  expect(isActive(tab3, panel3)).toBe(false);

  tab2.click();
  expect(isActive(tab1, panel1)).toBe(false);
  expect(isActive(tab2, panel2)).toBe(true);
  expect(isActive(tab3, panel3)).toBe(false);

  tab3.click();
  expect(isActive(tab1, panel1)).toBe(false);
  expect(isActive(tab2, panel2)).toBe(false);
  expect(isActive(tab3, panel3)).toBe(true);
});

test('The element that serves as the container for the set of tabs has role tablist.', () => {
  expect(
    tablist.getAttribute('role') === 'tablist'
  ).toBe(true);
});

test('Each element that serves as a tab has role tab and is contained within the element with role tablist.', () => {
  expect(
    tabs.every(tab => tab.getAttribute('role') === 'tab')
  ).toBe(true);
});
test('Each element that contains the content panel for a tab has role tabpanel.', () => {
  expect(
    panels.every(panel => panel.getAttribute('role') === 'tabpanel')
  ).toBe(true);
});

test('tablist has accessible label via aria-label or aria-labelledby', () => {
  const ariaLabel = tablist.getAttribute('aria-label');
  const ariaLabelledby = tablist.getAttribute('aria-labelledby');
  const tab = ariaLabelledby && document.getElementById(ariaLabelledby);

  expect(
    !!ariaLabel || !!tab
  ).toBe(true);
});

test('Each element with role tab has the property aria-controls referring to its associated tabpanel element.', () => {
  expect(
    tabs.every(tab => {
      const panel = document.getElementById(
        tab.getAttribute('aria-controls')
      );
      return panel.getAttribute('role') === 'tabpanel';
    })
  ).toBe(true)
});

test('The active tab element has the state aria-selected set to true and all other tab elements have it set to false.', () => {
  const [tab1, tab2, tab3] = tabs;
  // activate the first tab
  tab1.click();
  expect(tab1.getAttribute('aria-selected')).toBe('true');
  expect(tab2.getAttribute('aria-selected')).toBe('false');
  expect(tab3.getAttribute('aria-selected')).toBe('false');

  tab2.click();
  expect(tab1.getAttribute('aria-selected')).toBe('false');
  expect(tab2.getAttribute('aria-selected')).toBe('true');
  expect(tab3.getAttribute('aria-selected')).toBe('false');
});

test('Each element with role tabpanel has the property aria-labelledby referring to its associated tab element.', () => {
  expect(
    panels.every(panel => {
      const tab = document.getElementById(
        panel.getAttribute('aria-labelledby')
      );
      return tab.getAttribute('role') === 'tab';
    })
  ).toBe(true)
});
