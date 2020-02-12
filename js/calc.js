"use strict";
let ansCounter;
const rndTo = (n) => +n.toPrecision(8);
const ansForm = (ans) => `\\text{Ans}${ans.slice(3)}`;
const numForm = (avg, sd) => `(${avg}\\pm${sd})`;
function inpsFromDiv(div) {
    const inpDiv = div.childNodes[1];
    const avgInp = inpDiv.childNodes[0].childNodes[0];
    const sdInp = inpDiv.childNodes[2].childNodes[0];
    return [avgInp, avgInp.value, sdInp.value];
}
function cGetInps() {
    const inpDivs = document.getElementsByClassName('inps');
    return Array.from(inpDivs).map((val) => {
        const actDiv = val.childNodes[0].childNodes[0];
        const actInp = actDiv.childNodes[0];
        const [avgInp, avgVal, sdVal] = inpsFromDiv(val);
        return [avgInp, actInp.value, avgVal, sdVal];
    });
}
function nGetInp() {
    const outDiv = document.getElementsByClassName('inps')[0];
    return inpsFromDiv(outDiv);
}
function parAns(avgInp, avgStr) {
    const result = window.localStorage.getItem(avgStr);
    if (result === null) {
        alert(`${avgStr} does not exist!`);
        avgInp.focus();
        return [0, 0, 0];
    }
    const [avg, sd] = JSON.parse(result).splice(1);
    return [1, avg, sd];
}
function getNums(avgInp, avgStr, sdStr) {
    let avg;
    let sd;
    const isAns = /^Ans\d$/.test(avgStr);
    if (isAns) {
        let success;
        [success, avg, sd] = parAns(avgInp, avgStr);
        if (!success)
            return [0, 0, 0, 0];
    }
    else {
        avg = +avgStr;
        sd = +sdStr;
    }
    return [1, avg, sd, isAns ? 1 : 0];
}
function postProc(form, avg, sd) {
    window.localStorage.setItem(`Ans${ansCounter}`, JSON.stringify([form, avg, sd]));
    displayAns();
}
function calcAddMin() {
    let avgSum = 0;
    let sdSqSum = 0;
    let formStr = '';
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
        if (!success)
            return;
        if (action === '-') {
            avgSum -= avg;
            formStr += '-';
        }
        else {
            avgSum += avg;
            formStr += '+';
        }
        sdSqSum += sd * sd;
        formStr += isAns ? ansForm(avgStr) : numForm(avg, sd);
    }
    if (formStr.charAt(0) === '+')
        formStr = formStr.slice(1);
    const sdSum = rndTo(Math.sqrt(sdSqSum));
    avgSum = rndTo(avgSum);
    postProc(formStr, avgSum, sdSum);
}
function calcMulDiv() {
    let avgProd = 1;
    let sdSqSum = 0;
    let formStr = '';
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
        if (!success)
            return;
        if (action === '÷') {
            avgProd /= avg;
            formStr += '÷';
        }
        else {
            avgProd *= avg;
            formStr += '×';
        }
        sdSqSum += Math.pow(sd / avg, 2);
        formStr += isAns ? ansForm(avgStr) : numForm(avg, sd);
    }
    if (formStr.charAt(0) === '×')
        formStr = formStr.slice(1);
    else
        formStr = '1' + formStr;
    const sdSum = rndTo(avgProd * Math.sqrt(sdSqSum));
    avgProd = rndTo(avgProd);
    postProc(formStr, avgProd, sdSum);
}
function calcLn() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
    if (!success)
        return;
    let avgRes = Math.log(avg);
    const sdRes = rndTo(sd / avg);
    avgRes = rndTo(avgRes);
    const formStr = `\\ln{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}
function calcLog() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
    if (!success)
        return;
    let avgRes = Math.log10(avg);
    const sdRes = rndTo(sd / avg * Math.log10(Math.E));
    avgRes = rndTo(avgRes);
    const formStr = `\\log{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}
function calcExp() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
    if (!success)
        return;
    let avgRes = Math.exp(avg);
    const sdRes = rndTo(sd * avgRes);
    avgRes = rndTo(avgRes);
    const formStr = `e^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}
function calc10xp() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns] = getNums(avgInp, avgStr, sdStr);
    if (!success)
        return;
    let avgRes = Math.pow(10, avg);
    const sdRes = rndTo(sd * avgRes * Math.log(10));
    avgRes = rndTo(avgRes);
    const formStr = `10^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}
