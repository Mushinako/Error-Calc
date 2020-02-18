"use strict";


function keyLreg(ev: KeyboardEvent): void { }


function lregInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    // Clear input div
    clearChildren(inDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('Linear Regression');
    inDiv.appendChild(ttlElmt);
}