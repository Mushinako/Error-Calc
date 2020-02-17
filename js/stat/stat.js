"use strict";
let statInp;
function keyStat(ev) {
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.altKey || ev.metaKey || ev.ctrlKey)
            return;
        if (ev.shiftKey) {
            ev.preventDefault();
            statCalc();
        }
    }
}
function statInit() { }
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyLreg);
    statInp = document.getElementById('statinp');
    const calc = document.getElementById('statcalc');
    calc.addEventListener('click', statCalc);
    document.addEventListener('keypress', keyStat);
});
