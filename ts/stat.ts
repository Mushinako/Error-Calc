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

document.addEventListener('DOMContentLoaded', (): void => {
    statInp = <HTMLTextAreaElement>document.getElementById('statinp');
    const calc: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('statcalc');
    calc.addEventListener('click', statCalc);
    document.addEventListener('keypress', keyStat);
});