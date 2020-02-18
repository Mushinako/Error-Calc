"use strict";

/**
 * Linear regression keyboard shortcuts
 * 
 * @param ev 
 */
function keyLreg(ev: KeyboardEvent): void { }

/**
 * Initalization linear regression calculation interface
 */
function lregInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    // Clear input div
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('Linear Regression');
    inDiv.appendChild(ttlElmt);
}