"use strict";

// Ans ID counter
let ansCounter: number;

/**
 * Round to 10 significant figures
 * 
 * @param {number} n - Number to be rounded
 */
const rndTo = (n: number): number => +n.toPrecision(10);

/**
 * Formula representation for Ans
 * 
 * @param   {string} ans - Ans name
 * @returns {string}     - TeX representation
 */
const ansForm = (ans: string): string => `\\text{Ans}${ans.slice(3)}`;

/**
 * Formula representation for avg±sd
 * 
 * @param   {number} avg - Average
 * @param   {number} sd  - SD
 * @returns {string}     - TeX representation
 */
const numForm = (avg: number, sd: number): string => `(${avg}\\pm${sd})`;

/**
 * Get inputs values from a input row
 * 
 * @param   {Element} div      - The input row
 * @returns {HTMLInputElement} - The input element
 * @returns {string}           - Avg value
 * @returns {string}           - SD value
 */
function inpsFromDiv(div: Element): [HTMLInputElement, string, string] {
    const inpDiv: ChildNode = div.childNodes[1];
    const avgInp: HTMLInputElement = <HTMLInputElement>inpDiv.childNodes[0].childNodes[0];
    const sdInp: HTMLInputElement = <HTMLInputElement>inpDiv.childNodes[2].childNodes[0];
    return [avgInp, avgInp.value, sdInp.value];
}

/**
 * Get all inputs, for c-operations
 * 
 * @returns {HTMLInputElement[]} - Avg input elements
 * @returns {string[]}           - <select> choices
 * @returns {string[]}           - Avg values
 * @returns {string[]}           - SD values
 */
function cGetInps(): [HTMLInputElement, string, string, string][] {
    const inpDivs: HTMLCollectionOf<Element> = document.getElementsByClassName('inps');
    return Array.from(inpDivs).map((val: Element): [HTMLInputElement, string, string, string] => {
        const actDiv: ChildNode = val.childNodes[0].childNodes[0];
        const actInp: HTMLInputElement = <HTMLInputElement>actDiv.childNodes[0];
        const [avgInp, avgVal, sdVal]: [HTMLInputElement, string, string] = inpsFromDiv(val);
        return [avgInp, actInp.value, avgVal, sdVal]
    });
}

/**
 * Get the single input, for n-operations
 * 
 * @returns {HTMLInputElement} - Avg input element
 * @returns {string}           - Avg value
 * @returns {string}           - SD value
 */
function nGetInp(): [HTMLInputElement, string, string] {
    const outDiv: Element = document.getElementsByClassName('inps')[0];
    return inpsFromDiv(outDiv);
}

/**
 * Get the 2 inputs, for t-operations

 * @returns {HTMLInputElement} - Avg input element
 * @returns {string}           - Avg value
 * @returns {string}           - SD value
 * @returns {number}           - Exponent or equivalent
 */
function tGetInps(): [[HTMLInputElement, string, string], number] {
    const inpDivs: HTMLCollectionOf<Element> = document.getElementsByClassName('inps');
    const base: [HTMLInputElement, string, string] = inpsFromDiv(inpDivs[0]);
    const expInp: HTMLInputElement = <HTMLInputElement>inpDivs[1].childNodes[1].childNodes[0].childNodes[0];
    return [base, +expInp.value];
}

/**
 * Get Ans given in the Avg input
 * 
 * @param   {HTMLInputElement} avgInp - Avg input element
 * @param   {string}           avgStr - Ans name
 * @returns {number}                  - Whether the requested Ans exists
 * @returns {number}                  - Avg
 * @returns {number}                  - SD
 */
function parAns(avgInp: HTMLInputElement, avgStr: string): [number, number, number] {
    const result: string | null = window.localStorage.getItem(avgStr);
    // Check if requested Ans exists
    if (result === null) {
        alert(`${avgStr} does not exist!`);
        avgInp.focus();
        return [0, 0, 0];
    }
    const [avg, sd]: [number, number] = JSON.parse(result).splice(1);
    return [1, avg, sd];
}

/**
 * Parse a row of input into numbers
 * 
 * @param   {HTMLInputElement} avgInp - Avg input element
 * @param   {string}           avgStr - Avg input value
 * @param   {string}           sdStr  - SD input value
 * @returns {number}                  - Whether the parsing is successful
 * @returns {number}                  - Avg
 * @returns {number}                  - SD
 * @returns {number}                  - Whether the input is Ans request
 */
function getNums(avgInp: HTMLInputElement, avgStr: string, sdStr: string): [number, number, number, number] {
    let avg: number;
    let sd: number;
    const isAns: boolean = /^Ans\d$/.test(avgStr);
    // Different reactions, depending on whether the input is Ans request
    if (isAns) {
        let success: number;
        [success, avg, sd] = parAns(avgInp, avgStr);
        if (!success) return [0, 0, 0, 0];
    } else {
        avg = +avgStr;
        sd = +sdStr;
    }
    return [1, avg, sd, isAns ? 1 : 0];
}

/**
 * Post-processing: setting localStorage and parse output
 * 
 * @param {string} form - Formula, TeX format
 * @param {number} avg  - Calculated average
 * @param {number} sd   - Calculated SD
 */
function postProc(form: string, avg: number, sd: number): void {
    window.localStorage.setItem(`Ans${ansCounter}`, JSON.stringify([form, avg, sd]));
    displayAns();
}

/**
 * Addition-subtraction calculations
 */
function calcAddMin(): void {
    let avgSum: number = 0;
    let sdSqSum: number = 0;
    let formStr: string = '';
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
        if (!success) return;
        if (action === '-') {
            avgSum -= avg;
            formStr += '-';
        } else {
            avgSum += avg;
            formStr += '+';
        }
        sdSqSum += sd * sd;
        formStr += isAns ? ansForm(avgStr) : numForm(avg, sd);
    }
    if (formStr.charAt(0) === '+') formStr = formStr.slice(1);
    const sdSum: number = rndTo(Math.sqrt(sdSqSum));
    avgSum = rndTo(avgSum);
    postProc(formStr, avgSum, sdSum);
}

/**
 * Multiplication-division calculations
 */
function calcMulDiv(): void {
    let avgProd: number = 1;
    let sdSqSum: number = 0;
    let formStr: string = '';
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
        if (!success) return;
        if (action === '÷') {
            avgProd /= avg;
            formStr += '÷';
        } else {
            avgProd *= avg;
            formStr += '×';
        }
        sdSqSum += Math.pow(sd / avg, 2);
        formStr += isAns ? ansForm(avgStr) : numForm(avg, sd);
    }
    if (formStr.charAt(0) === '×') formStr = formStr.slice(1);
    else formStr = '1' + formStr;
    const sdSum = rndTo(avgProd * Math.sqrt(sdSqSum));
    avgProd = rndTo(avgProd);
    postProc(formStr, avgProd, sdSum);
}

/**
 * Natural log calculations
 */
function calcLn(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
    if (!success) return;
    let avgRes: number = Math.log(avg);
    const sdRes: number = rndTo(sd / avg);
    avgRes = rndTo(avgRes);
    const formStr: string = `\\ln{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}

/**
 * Common log calculations
 */
function calcLog(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
    if (!success) return;
    let avgRes: number = Math.log10(avg);
    const sdRes: number = rndTo(sd / avg * Math.log10(Math.E));
    avgRes = rndTo(avgRes);
    const formStr: string = `\\log{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}

/**
 * e^a calculations
 */
function calcExp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
    if (!success) return;
    let avgRes: number = Math.exp(avg);
    const sdRes: number = rndTo(sd * avgRes);
    avgRes = rndTo(avgRes);
    const formStr: string = `e^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}

/**
 * 10^a calculations
 */
function calc10xp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns]: [number, number, number, number] = getNums(avgInp, avgStr, sdStr);
    if (!success) return;
    let avgRes: number = Math.pow(10, avg);
    const sdRes: number = rndTo(sd * avgRes * Math.log(10));
    avgRes = rndTo(avgRes);
    const formStr: string = `10^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}

/**
 * a^x calculations
 */
function calcPwr(): void {
    const [base, exp]: [[HTMLInputElement, string, string], number] = tGetInps();
    const [inp, avgStr, sdStr]: [HTMLInputElement, string, string] = base;
    const [success, avg, sd, isAns]: [number, number, number, number] = getNums(inp, avgStr, sdStr);
    if (!success) return;
    let avgRes: number = Math.pow(avg, exp);
    const sdRes: number = rndTo(sd / avg * exp * avgRes);
    avgRes = rndTo(avgRes);
    const formStr: string = `{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}^{${exp}}`;
    postProc(formStr, avgRes, sdRes);
}