
const axe = require('axe-core');
const CsunTabs = require('../');
const fixture = require('./fixture');
const app = document.getElementById('app');
// render the app
app.innerHTML = fixture;
// instantiate new Csuntabs
new CsunTabs(document.getElementById('demo'));

axe.run(app)
  .then(({ violations }) => {
    if (violations.length) {
      console.warn('axe issues: ', violations);
    }
  })
