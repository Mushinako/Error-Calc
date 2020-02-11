"use strict";


let ansCounter: number;


function calcAddMin(): void {
    const inpDivs: HTMLCollectionOf<Element> = document.getElementsByClassName('inps');
    let avgSum: number = 0;
    let sdSqSum: number = 0;
    let formStr: string = '';
    for (const inpDiv of Array.from(inpDivs)) {
        const actDiv: HTMLDivElement = <HTMLDivElement>(inpDiv.childNodes[0]).childNodes[0];
        const actInp: HTMLInputElement = <HTMLInputElement>actDiv.childNodes[0];
        const inp: HTMLDivElement = <HTMLDivElement>inpDiv.childNodes[1];
        const avgInp: HTMLInputElement = <HTMLInputElement>(inp.childNodes[0]).childNodes[0];
        const sdInp: HTMLInputElement = <HTMLInputElement>(inp.childNodes[2]).childNodes[0];
        const action: string = actInp.value;
        const avgStr: string = avgInp.value;
        const sdStr: string = sdInp.value;
        let avg: number;
        let sd: number;
        if (/^Ans\d$/.test(avgStr)) {
            const result: string | null = window.localStorage.getItem(avgStr);
            if (result === null) {
                alert(`${avgStr} does not exist!`);
                avgInp.focus();
                return;
            }
            let _: string;
            [_, avg, sd] = JSON.parse(result);
        } else {
            avg = +avgStr;
            sd = +sdStr;
        }
        if (action === '-') {
            avgSum -= avg;
            formStr += '-';
        } else {
            avgSum += avg;
            formStr += '+';
        }
        sdSqSum += sd * sd;
        formStr += `(${avg}\\pm${sd})`;
    }
    if (formStr.charAt(0) === '+') formStr = formStr.slice(1);
    const sdSum: number = Math.sqrt(sdSqSum);
    window.localStorage.setItem(`Ans${ansCounter}`, JSON.stringify([formStr, avgSum, sdSum]));
    displayAns();
}


function calcMulDiv(): void { }


function calcLn(): void { }


function calcLog(): void { }


function calcExp(): void { }


function calc10xp(): void { }