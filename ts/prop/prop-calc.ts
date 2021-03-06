"use strict";

/**
 * Error propagation calculation functions
 * 
 * - Calculations
 */

// Ans ID counter
let ansCounter: number;

/**
 * Formula representation for Ans
 * 
 * @param   {string} ans - Ans name
 * @returns {string}     - TeX representation
 */
const ansForm = (ans: string): string => `\\text{Err}${ans.slice(3)}`;

/**
 * Formula representation for avg±sd
 * 
 * @param   {string} avg - Average
 * @param   {string} sd  - SD
 * @returns {string}     - TeX representation
 */
const numForm = (avg: string, sd: string): string => `(${beauInp(avg)}\\pm${beauInp(sd)})`;

/**
 * Return the exponent log10 for the highest digit
 * 
 * @param   {number} n - Number to be inspected
 * @returns {number}   - The exponent
 */
const highestExp = (n: number): number => +n.toExponential().split('e')[1];

/**
 * Return the accuracy given sigfig and vice versa
 * 
 * @param   {number} n  - Number to be inspected
 * @param   {number} sf - Sigfig
 * @returns {number}    - The accuracy exponent
 */
const sigFigDecimalConversion = (n: number, sf: number): number => +n.toExponential().split('e')[1] - sf + 1;

/**
 * Number accuracy log10 for scientific notation
 * 
 * @param   {string} co  - Coefficient
 * @param   {string} exp - Exponent
 * @returns {number}     - The accuracy exponent
 */
const expAccuracy = (co: string, exp: string): number => nExpAccuracy(co) + +exp;

/**
 * Beautify input
 * 
 * @param {string} n - The number to be beautified
 */
function beauInp(n: string): string {
    if (n === '') return '0';
    let sign: string = '';
    if (n.charAt(0) === '-') {
        sign = '-';
        n = n.slice(1);
    }
    if (n.charAt(0) === '.') n = '0' + n;
    if (n.includes('e')) n = n.toLowerCase().replace('e', '\\times 10^{') + '}';
    return sign + n;
}

/**
 * Number accuracy log10 for non-scientific notation
 * 
 * @param   {string} n - The number to be parsed
 * @returns {number}   - The accuracy exponent
 */
function nExpAccuracy(n: string): number {
    if (n.includes('.')) {
        // Decimal
        const dec: string = n.split('.')[1];
        return -dec.length;
    }
    // Integer
    if (n.replace(/0/g, '') === '') return 0;
    const rev: string = n.split('').reverse().join('');
    return rev.search(/[^0]/);
}

/**
 * Number accuracy log10
 *   E.g., 2.3 is accurate to 0.1, which is 10^(-1), therefore -1 is returned
 * 
 * @param   {string} n - The number to be parsed
 * @returns {number}   - The accuracy exponent
 */
function numAccuracy(n: string): number {
    // Non-scientific notation
    if (!n.includes('e')) return nExpAccuracy(n);
    // Scientific notation
    const [co, exp]: string[] = n.split('e');
    return expAccuracy(co, exp);
}

/**
 * Get inputs values from a input row
 * 
 * @param   {Element} rowDiv   - The input row
 * @returns {HTMLInputElement} - The input element
 * @returns {string}           - Avg value
 * @returns {string}           - SD value
 */
function inpsFromDiv(rowDiv: Element): [HTMLInputElement, string, string] {
    const inpDiv: ChildNode = rowDiv.childNodes[1];
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
 * @returns {number}                  - Accuracy
 */
function parseAnsFromAvg(avgInp: HTMLInputElement, avgStr: string): [number, number, number, number] {
    const result: string | null = window.localStorage.getItem(avgStr);
    // Check if requested Ans exists
    if (result === null) {
        alert(`${avgStr} does not exist!`);
        avgInp.focus();
        return [0, 0, 0, 0];
    }
    const [avg, sd, sf]: [number, number, number] = JSON.parse(result).splice(1);
    return [1, avg, sd, sf];
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
 * @returns {number}                  - Accuracy
 */
function parseNumsFromRow(avgInp: HTMLInputElement, avgStr: string, sdStr: string): [number, number, number, number, number] {
    let avg: number;
    let sd: number;
    let sf: number;
    const isAns: boolean = /^Err\d$/.test(avgStr);
    // Different reactions, depending on whether the input is Ans request
    if (isAns) {
        let success: number;
        [success, avg, sd, sf] = parseAnsFromAvg(avgInp, avgStr);
        if (!success) return [0, 0, 0, 0, 0];
    } else {
        avg = +avgStr;
        sd = +sdStr;
        sf = numAccuracy(avgStr);
    }
    return [1, avg, sd, isAns ? 1 : 0, sf];
}

/**
 * Post-processing: setting localStorage and parse output
 * 
 * @param {string} form - Formula, TeX format
 * @param {number} avg  - Calculated average
 * @param {number} sd   - Calculated SD
 * @param {number} sf   - Accuracy log10
 */
function postProcessing(form: string, avg: number, sd: number, sf: number): void {
    window.localStorage.setItem(`Err${ansCounter}`, JSON.stringify([form, avg, sd, sf]));
    displayAns();
}

/**
 * Addition-subtraction calculations
 */
function calcAddMin(): void {
    let avgSum: number = 0;
    let sdSqSum: number = 0;
    let formStr: string = '';
    let sfAll: number = -Infinity;
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
        if (!success) return;
        if (action === '-') {
            avgSum -= avg;
            formStr += '-';
        } else {
            avgSum += avg;
            formStr += '+';
        }
        sdSqSum += sd * sd;
        formStr += isAns ? ansForm(avgStr) : numForm(avgStr, sdStr);
        sfAll = Math.max(sfAll, sf);
    }
    if (formStr.charAt(0) === '+') formStr = formStr.slice(1);
    const sdSum: number = Math.sqrt(sdSqSum);
    postProcessing(formStr, avgSum, sdSum, sfAll);
}

/**
 * Multiplication-division calculations
 */
function calcMulDiv(): void {
    let avgProd: number = 1;
    let sdSqSum: number = 0;
    let formStr: string = '';
    let sfSAll: number = Infinity;
    for (const [avgInp, action, avgStr, sdStr] of cGetInps()) {
        const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
        if (!success) return;
        if (action === '÷') {
            avgProd /= avg;
            formStr += '÷';
        } else {
            avgProd *= avg;
            formStr += '×';
        }
        sdSqSum += Math.pow(sd / avg, 2);
        formStr += isAns ? ansForm(avgStr) : numForm(avgStr, sdStr);
        sfSAll = Math.min(sfSAll, sigFigDecimalConversion(avg, sf));
    }
    if (formStr.charAt(0) === '×') formStr = formStr.slice(1);
    else formStr = '1' + formStr;
    const sdSum = Math.abs(avgProd) * Math.sqrt(sdSqSum);
    postProcessing(formStr, avgProd, sdSum, sigFigDecimalConversion(avgProd, sfSAll));
}

/**
 * Natural log calculations
 */
function calcLn(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success) return;
    const avgRes: number = Math.log(avg);
    const sdRes: number = Math.abs(sd / avg);
    const formStr: string = `\\ln{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avg, sf));
}

/**
 * Common log calculations
 */
function calcLog(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success) return;
    const avgRes: number = Math.log10(avg);
    const sdRes: number = Math.abs(sd / avg * Math.log10(Math.E));
    const formStr: string = `\\log{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avg, sf));
}

/**
 * e^a calculations
 */
function calcExp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success) return;
    const avgRes: number = Math.exp(avg);
    const sdRes: number = Math.abs(sd * avgRes);
    const formStr: string = `e^{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avgRes, sf));
}

/**
 * 10^a calculations
 */
function calc10xp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = nGetInp();
    const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(avgInp, avgStr, sdStr);
    if (!success) return;
    const avgRes: number = Math.pow(10, avg);
    const sdRes: number = Math.abs(sd * avgRes * Math.log(10));
    const formStr: string = `10^{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}`;
    postProcessing(formStr, avgRes, sdRes, -sigFigDecimalConversion(avgRes, sf));
}

/**
 * a^x calculations
 */
function calcPwr(): void {
    const [base, exp]: [[HTMLInputElement, string, string], number] = tGetInps();
    const [inp, avgStr, sdStr]: [HTMLInputElement, string, string] = base;
    const [success, avg, sd, isAns, sf]: [number, number, number, number, number] = parseNumsFromRow(inp, avgStr, sdStr);
    if (!success) return;
    const avgRes: number = Math.pow(avg, exp);
    const sdRes: number = Math.abs(sd / avg * exp * avgRes);
    const formStr: string = `{${isAns ? ansForm(avgStr) : numForm(avgStr, sdStr)}}^{${exp}}`;
    postProcessing(formStr, avgRes, sdRes, sigFigDecimalConversion(avgRes, sigFigDecimalConversion(avg, sf)));
}