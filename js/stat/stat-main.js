"use strict";
let statInp;
function keyStat(ev) {
    if (ev.altKey || ev.metaKey || ev.ctrlKey)
        return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            ev.preventDefault();
            statCalc();
        }
    }
    if (ev.shiftKey)
        return;
}
function statInit() {
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    statInp = document.getElementById('statinp');
    const calc = document.getElementById('statcalc');
    calc.addEventListener('click', statCalc);
    document.addEventListener('keypress', keyStat);
}
