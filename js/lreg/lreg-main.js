"use strict";
function keyLreg(ev) { }
function lregInit() {
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    clearChildren(inDiv);
    const ttlElmt = createTtl('Linear Regression');
    inDiv.appendChild(ttlElmt);
}
