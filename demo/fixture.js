'use strict';

module.exports = `
    <div id="demo" role="tabs" aria-label="CSUN">
        <button
            role="tab"
            aria-selected="true"
            aria-controls="csun17-panel"
            id="csun17">
            CSUN 17
        </button>
        <button
            role="tab"
            aria-selected="false"
            aria-controls="csun18-panel"
            id="csun18">
            CSUN 18
        </button>
        <button
            role="tab"
            aria-selected="false"
            aria-controls="csun19-panel"
            id="csun19">
            CSUN 19
        </button>
    </div>
    <div role="tabpanel" id="csun17-panel" aria-labelledby="csun17">
        <p>CSUN 2017 was my first CSUN and my talk was titled "Advanced ARIA"</p>
        <a href="https://schne324.github.io/csun-advanced-aria/" target="_blank">
            View the csun17 slides here
        </a>
    </div>
    <div role="tabpanel" id="csun18-panel" aria-labelledby="csun18">
        <p>At CSUN 2018, my coworker and I presented "Nightmare on HTML Street"</p>
        <a href="https://schne324.github.io/csun-combobo-talk-slides/" target="_blank">
            View the csun18 slides here
        </a>
    </div>
    <div role="tabpanel" id="csun19-panel" aria-labelledby="csun19">
        <p>At CSUN 2019 (right now!), I did some live coding...and it was a DISASTER (kidding hopefully)</p>
        <a href="https://github.com/schne324/csun19-tdd-component" target="_blank">
            View the csun19 repo here
        </a>
    </div>
`;
