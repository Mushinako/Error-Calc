"use strict";

let statInp: HTMLTextAreaElement;


function keyStat(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
        if (ev.shiftKey) {
            ev.preventDefault();
            statCalc();
        }
    }
}


function statInit(): void { }

document.addEventListener('DOMContentLoaded', (): void => {
    // Keyboard events
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    // Something
    statInp = <HTMLTextAreaElement>document.getElementById('statinp');
    const calc: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('statcalc');
    calc.addEventListener('click', statCalc);
    document.addEventListener('keypress', keyStat);
});