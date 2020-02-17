"use strict";


function keyLreg(ev: KeyboardEvent): void { }


function lregInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyLreg);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
}