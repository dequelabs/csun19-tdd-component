
const Csuntabs = require('../');
const fixture = require('../test/fixture');

document.getElementById('app').innerHTML = fixture;

new Csuntabs(document.getElementById('demo'));
