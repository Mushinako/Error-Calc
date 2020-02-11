"use strict";
let ansCounter;
function calcAddMin() {
    const inpDivs = document.getElementsByClassName('inps');
    let avgSum = 0;
    let sdSqSum = 0;
    let formStr = '';
    for (const inpDiv of Array.from(inpDivs)) {
        const actDiv = (inpDiv.childNodes[0]).childNodes[0];
        const actInp = actDiv.childNodes[0];
        const inp = inpDiv.childNodes[1];
        const avgInp = (inp.childNodes[0]).childNodes[0];
        const sdInp = (inp.childNodes[2]).childNodes[0];
        const action = actInp.value;
        const avgStr = avgInp.value;
        const sdStr = sdInp.value;
        let avg;
        let sd;
        if (/^Ans\d$/.test(avgStr)) {
            const result = window.localStorage.getItem(avgStr);
            if (result === null) {
                alert(`${avgStr} does not exist!`);
                avgInp.focus();
                return;
            }
            let _;
            [_, avg, sd] = JSON.parse(result);
        }
        else {
            avg = +avgStr;
            sd = +sdStr;
        }
        if (action === '-') {
            avgSum -= avg;
            formStr += '-';
        }
        else {
            avgSum += avg;
            formStr += '+';
        }
        sdSqSum += sd * sd;
        formStr += `(${avg}\\pm${sd})`;
    }
    if (formStr.charAt(0) === '+')
        formStr = formStr.slice(1);
    let sdSum = Math.sqrt(sdSqSum);
    avgSum = Math.round((avgSum + Number.EPSILON) * 1e10) / 1e10;
    sdSum = Math.round((sdSum + Number.EPSILON) * 1e10) / 1e10;
    window.localStorage.setItem(`Ans${ansCounter}`, JSON.stringify([formStr, avgSum, sdSum]));
    displayAns();
}
function calcMulDiv() { }
function calcLn() { }
function calcLog() { }
function calcExp() { }
function calc10xp() { }
