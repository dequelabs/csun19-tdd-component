
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

  init() {
    const initiallyActive = this.panels.find(panels => {
      return panels.classList.contains(this.options.activeClass);
    }) || this.tabs[0];

    this.activate(initiallyActive);
    this.tablist.addEventListener('click', this.onClick);
    this.tablist.addEventListener('keydown', this.onKeydown);
  }

  activate(newlyActive, focus) {
    const { activeClass } = this.options;
    this.tabs.forEach((tab, index) => {
      const isActive = tab === newlyActive;
      const panel = this.panels[index];

      tab.tabIndex = isActive ? 0 : -1;
      tab.setAttribute('aria-selected', isActive);

      if (isActive) {
        panel.classList.add(activeClass);
        this.activeIndex = index;
      } else {
        panel.classList.remove(activeClass);
      }
    });

    if (focus) {
      newlyActive.focus();
    }
  }

  onClick(e) {
    if (this.tabs.indexOf(e.target) === -1) {
      return;
    }

    this.activate(e.target);
  }

  onKeydown(e) {
    if (this.tabs.indexOf(e.target) === -1) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault();
        const leftIndex = this.activeIndex === 0
          ? this.tabs.length - 1 // from first to last
          : this.activeIndex - 1;

        this.activate(this.tabs[leftIndex], true);
        break;
      }

      case 'ArrowRight': {
        e.preventDefault();
        const rightIndex = this.activeIndex === this.tabs.length - 1
          ? 0 // from last to first
          : this.activeIndex + 1;

        this.activate(this.tabs[rightIndex], true);
        break;
      }

      default:
        break;
    }
  }
}
