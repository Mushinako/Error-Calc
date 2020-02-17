"use strict";

let statInp: HTMLTextAreaElement;


function keyStat(ev: KeyboardEvent): void {
    // No Alt, Win/Cmd, or Ctrl allowed
    if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            // Shift+Enter: Run calculation
            ev.preventDefault();
            statCalc();
        }
    }
    // No shift allowed
    if (ev.shiftKey) return;
}


function statInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    // Something
    statInp = <HTMLTextAreaElement>document.getElementById('statinp');
    const calc: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('statcalc');
    calc.addEventListener('click', statCalc);
    document.addEventListener('keypress', keyStat);
}
