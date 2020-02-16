"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const propDiv = document.getElementById('propdiv');
    const statDiv = document.getElementById('statdiv');
    const lregDiv = document.getElementById('lregdiv');
    const propBtn = document.getElementById('prop');
    const statBtn = document.getElementById('stat');
    const lregBtn = document.getElementById('lreg');
    propBtn.addEventListener('click', () => {
        propBtn.parentElement.classList.add('active');
        statBtn.parentElement.classList.remove('active');
        lregBtn.parentElement.classList.remove('active');
        propDiv.classList.remove('no-display');
        statDiv.classList.add('no-display');
        lregDiv.classList.add('no-display');
        document.addEventListener('keypress', keyProp);
        document.removeEventListener('keypress', keyStat);
        document.removeEventListener('keypress', keyLreg);
    });
});
