"use strict";
let ansCounter;
const ansForm = (ans) => `\\text{Err}${ans.slice(3)}`;
const numForm = (avg, sd) => `(${beauInp(avg)}\\pm${beauInp(sd)})`;
const highestExp = (n) => +n.toExponential().split('e')[1];
const sigFigDecimalConversion = (n, sf) => +n.toExponential().split('e')[1] - sf + 1;
const expAccuracy = (co, exp) => nExpAccuracy(co) + +exp;
function beauInp(n) {
    if (n === '')
        return '0';
    let sign = '';
    if (n.charAt(0) === '-') {
        sign = '-';
        n = n.slice(1);
    }
    if (n.charAt(0) === '.')
        n = '0' + n;
    if (n.includes('e'))
        n = n.toLowerCase().replace('e', '\\times 10^{') + '}';
    return sign + n;
}
function nExpAccuracy(n) {
    if (n.includes('.')) {
        const dec = n.split('.')[1];
        return -dec.length;
    }
    if (n.replace(/0/g, '') === '')
        return 0;
    const rev = n.split('').reverse().join('');
    return rev.search(/[^0]/);
}
function numAccuracy(n) {
    if (!n.includes('e'))
        return nExpAccuracy(n);
    const [co, exp] = n.split('e');
    return expAccuracy(co, exp);
}
function inpsFromDiv(rowDiv) {
    const inpDiv = rowDiv.childNodes[1];
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
function tGetInps() {
    const inpDivs = document.getElementsByClassName('inps');
    const base = inpsFromDiv(inpDivs[0]);
    const expInp = inpDivs[1].childNodes[1].childNodes[0].childNodes[0];
    return [base, +expInp.value];
}
function parseAnsFromAvg(avgInp, avgStr) {
    const result = window.localStorage.getItem(avgStr);
    if (result === null) {
        alert(`${avgStr} does not exist!`);
        avgInp.focus();
        return [0, 0, 0, 0];
    }
    const [avg, sd, sf] = JSON.parse(result).splice(1);
    return [1, avg, sd, sf];
}
function parseNumsFromRow(avgInp, avgStr, sdStr) {
    let avg;
    let sd;
    let sf;
    const isAns = /^Err\d$/.test(avgStr);
    if (isAns) {
        let success;
        [success, avg, sd, sf] = parseAnsFromAvg(avgInp, avgStr);
        if (!success)
            return [0, 0, 0, 0, 0];
    }
    else {
        avg = +avgStr;
        sd = +sdStr;
        sf = numAccuracy(avgStr);
    }
    return [1, avg, sd, isAns ? 1 : 0, sf];
}
function postProcessing(form, avg, sd, sf) {
    window.localStorage.setItem(`Err${ansCounter}`, JSON.stringify([form, avg, sd, sf]));
    displayAns();
}
function calcAddMin() {
    let avgSum = 0;
    let sdSqSum = 0;
    let formStr = '';
    let sfAll = -Infinity;
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
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
        formStr += isAns ? ansForm(avgStr) : numForm(avgStr, sdStr);
        sfAll = Math.max(sfAll, sf);
    }
    if (formStr.charAt(0) === '+')
        formStr = formStr.slice(1);
    const sdSum = Math.sqrt(sdSqSum);
    postProcessing(formStr, avgSum, sdSum, sfAll);
}
function calcMulDiv() {
    let avgProd = 1;
    let sdSqSum = 0;
    let formStr = '';
    let sfSAll = Infinity;
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
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
        formStr += isAns ? ansForm(avgStr) : numForm(avgStr, sdStr);
        sfSAll = Math.min(sfSAll, sigFigDecimalConversion(avg, sf));
    }
    if (formStr.charAt(0) === '×')
        formStr = formStr.slice(1);
    else
        formStr = '1' + formStr;
    const sdSum = Math.abs(avgProd) * Math.sqrt(sdSqSum);
    postProcessing(formStr, avgProd, sdSum, sigFigDecimalConversion(avgProd, sfSAll));
}
function calcLn() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success)
        return;
    const avgRes = Math.log(avg);
    const sdRes = Math.abs(sd / avg);
    const formStr = `\\ln{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avg, sf));
}
function calcLog() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success)
        return;
    const avgRes = Math.log10(avg);
    const sdRes = Math.abs(sd / avg * Math.log10(Math.E));
    const formStr = `\\log{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avg, sf));
}
function calcExp() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success)
        return;
    const avgRes = Math.exp(avg);
    const sdRes = Math.abs(sd * avgRes);
    const formStr = `e^{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avgRes, sf));
}
function calc10xp() {
    const [avgInp, avgStr, sdStr] = nGetInp();
    const [success, avg, sd, isAns, sf] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success)
        return;
    const avgRes = Math.pow(10, avg);
    const sdRes = Math.abs(sd * avgRes * Math.log(10));
    const formStr = `10^{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avgRes, sf));
}
function calcPwr() {
    const [base, exp] = tGetInps();
    const [inp, avgStr, sdStr] = base;
    const [success, avg, sd, isAns, sf] = parseNumsFromRow(inp, avgStr, sdStr);
    if (!success)
        return;
    const avgRes = Math.pow(avg, exp);
    const sdRes = Math.abs(sd / avg * exp * avgRes);
    const formStr = `{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}^{${exp}}`;
    postProcessing(formStr, avgRes, sdRes, sigFigDecimalConversion(avgRes, sigFigDecimalConversion(avg, sf)));
}
