'use strict';

const defaults = {
  activeClass: 'active'
};
const getPanel = tab => (
  document.getElementById(
    tab.getAttribute('aria-controls')
  )
);

module.exports = class CsunTabs {
  constructor(tablist, options = {}) {
    this.options = Object.assign({}, defaults, options);
    // TODO: throw error if role is missing
    this.tablist = tablist;
    this.tabs = [...tablist.querySelectorAll('[role="tab"]')];
    this.panels = this.tabs.map(getPanel);
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.init();
  }

  init() {
    const initiallyActive = this.tabs.find(tab => {
      const panel = getPanel(tab);
      return panel.classList.contains(this.options.activeClass);
    }) || this.tabs[0];
    this.activate(initiallyActive);

    this.tablist.addEventListener('click', this.onClick);
    this.tablist.addEventListener('keydown', this.onKeydown);
  }

  activate(target, focus) {
    this.tabs.forEach((tab, i) => {
      const isActive = target === tab;
      const panel = getPanel(tab);

      tab.tabIndex = isActive ? 0 : -1;
      tab.setAttribute('aria-selected', isActive);

      if (isActive) {
        panel.classList.add(this.options.activeClass);
        this.activeIndex = i;
      } else {
        panel.classList.remove(this.options.activeClass);
      }
    });

    if (focus) {
      target.focus();
    }
  }

  onClick(e) {
    if (!this.tabs.includes(e.target)) {
      return;
    }

    this.activate(e.target);
  }

  onKeydown(e) {
    if (!this.tabs.includes(e.target)) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft': {
        const leftIndex = this.activeIndex === 0
          ? this.tabs.length - 1
          : this.activeIndex - 1;

        this.activate(this.tabs[leftIndex], true);
        break;
      }

      case 'ArrowRight': {
        const rightIndex = this.activeIndex === this.tabs.length - 1
          ? 0
          : this.activeIndex + 1;

        this.activate(this.tabs[rightIndex], true);
        break;
      }
    }
  }
}
