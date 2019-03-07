
const Csuntabs = require('../');
const fixture = require('./fixture');

document.getElementById('app').innerHTML = fixture;

new Csuntabs(document.getElementById('demo'));
