"use strict";

document.addEventListener('DOMContentLoaded', (): void => {
    const propDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('propdiv');
    const statDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('statdiv');
    const lregDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('lregdiv');
    const propBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('prop');
    const statBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('stat');
    const lregBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('lreg');
    propBtn.addEventListener('click', (): void => {
        propBtn.parentElement!.classList.add('active');
        statBtn.parentElement!.classList.remove('active');
        lregBtn.parentElement!.classList.remove('active');
        propDiv.classList.remove('no-display');
        statDiv.classList.add('no-display');
        lregDiv.classList.add('no-display');
        // Keyboard events
        document.addEventListener('keypress', keyProp);
        document.removeEventListener('keypress', keyStat);
        document.removeEventListener('keypress', keyLreg);
    });
    // statBtn.addEventListener('click', (): void => {
    //     statBtn.parentElement!.classList.add('active');
    //     propBtn.parentElement!.classList.remove('active');
    //     lregBtn.parentElement!.classList.remove('active');
    //     statDiv.classList.remove('no-display');
    //     propDiv.classList.add('no-display');
    //     lregDiv.classList.add('no-display');
    //     // Keyboard events
    //     document.addEventListener('keypress', keyStat);
    //     document.removeEventListener('keypress', keyProp);
    //     document.removeEventListener('keypress', keyLreg);
    // });
    // lregBtn.addEventListener('click', (): void => {
    //     lregBtn.parentElement!.classList.add('active');
    //     propBtn.parentElement!.classList.remove('active');
    //     statBtn.parentElement!.classList.remove('active');
    //     lregDiv.classList.remove('no-display');
    //     propDiv.classList.add('no-display');
    //     statDiv.classList.add('no-display');
    //     // Keyboard events
    //     document.addEventListener('keypress', keyLreg);
    //     document.removeEventListener('keypress', keyProp);
    //     document.removeEventListener('keypress', keyStat);
    // });
});