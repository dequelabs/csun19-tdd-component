
module.exports = class CsunTabs {
  constructor(tablist, options = {}) {
    this.options = Object.assign({}, options, {
      activeClass: 'active'
    });

    this.tablist = tablist;
    this.tabs = [...tablist.querySelectorAll('[role="tab"]')];
    this.panels = this.tabs.map(tab => {
      return document.getElementById(
        tab.getAttribute('aria-controls')
      );
    });
    this.onClick = this.onClick.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    this.init();
  }

  activate(toActivate, focus) {
    this.tabs.forEach((tab, i) => {
      const isActive = tab === toActivate;
      const panel = this.panels[i];

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
      toActivate.focus();
    }
  }

  init() {
    const initiallyActive = this.tabs.find((_, i) => {
      return this.panels[i].classList.contains(this.options.activeClass);
    }) || this.tabs[0];
    this.activate(initiallyActive);

    this.tablist.addEventListener('click', this.onClick);
    this.tablist.addEventListener('keydown', this.onKeydown);
  }

  onClick(e) {
    if (this.tabs.indexOf(e.target) > -1) {
      this.activate(e.target);
    }
  }

  onKeydown(e) {
    if (this.tabs.indexOf(e.target) === -1) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft': {
        const newIndex = this.activeIndex === 0
          ? this.tabs.length - 1
          : this.activeIndex - 1;
        this.activate(this.tabs[newIndex], true);
        break;
      }

      case 'ArrowRight': {
        const newIndex = this.activeIndex === this.tabs.length - 1
          ? 0
          : this.activeIndex + 1;
        this.activate(this.tabs[newIndex], true);
        break;
      }

      default:
        break;
    }
  }
}
