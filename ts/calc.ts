"use strict";

let ansCounter: number;


const rndTo10 = (n: number): number => +(n + Number.EPSILON).toPrecision(5);
// const rndTo10 = (n: number): number => Math.round((n + Number.EPSILON) * 1e10) / 1e10;


const ansForm = (ans: string): string => `\\text{Ans}${ans.slice(3)}`;


const numForm = (avg: number, sd: number): string => `(${avg}\\pm${sd})`;


function inpsFromDiv(div: Element): [HTMLInputElement, string, string] {
    const inpDiv: ChildNode = div.childNodes[1];
    const avgInp: HTMLInputElement = <HTMLInputElement>inpDiv.childNodes[0].childNodes[0];
    const sdInp: HTMLInputElement = <HTMLInputElement>inpDiv.childNodes[2].childNodes[0];
    return [avgInp, avgInp.value, sdInp.value];
}


function getInps(): [HTMLInputElement, string, string, string][] {
    const inpDivs: HTMLCollectionOf<Element> = document.getElementsByClassName('inps');
    return Array.from(inpDivs).map((val: Element): [HTMLInputElement, string, string, string] => {
        const actDiv: ChildNode = val.childNodes[0].childNodes[0];
        const actInp: HTMLInputElement = <HTMLInputElement>actDiv.childNodes[0];
        const [avgInp, avgVal, sdVal]: [HTMLInputElement, string, string] = inpsFromDiv(val);
        return [avgInp, actInp.value, avgVal, sdVal]
    });
}


function getInp(): [HTMLInputElement, string, string] {
    const outDiv: Element = document.getElementsByClassName('inps')[0];
    return inpsFromDiv(outDiv);
}


function parAns(avgInp: HTMLInputElement, avgStr: string): number[] {
    const result: string | null = window.localStorage.getItem(avgStr);
    if (result === null) {
        alert(`${avgStr} does not exist!`);
        avgInp.focus();
        return [0, 0, 0];
    }
    const [avg, sd]: [number, number] = JSON.parse(result).splice(1);
    return [1, avg, sd];
}


function getNums(avgInp: HTMLInputElement, avgStr: string, sdStr: string): number[] {
    let avg: number;
    let sd: number;
    const isAns: boolean = /^Ans\d$/.test(avgStr);
    if (isAns) {
        let result: number[] = parAns(avgInp, avgStr);
        if (!result.shift()) return [0, 0, 0, 0];
        [avg, sd] = result;
    } else {
        avg = +avgStr;
        sd = +sdStr;
    }
    return [1, avg, sd, isAns ? 1 : 0];
}


function postProc(form: string, avg: number, sd: number): void {
    window.localStorage.setItem(`Ans${ansCounter}`, JSON.stringify([form, avg, sd]));
    displayAns();
}


function calcAddMin(): void {
    let avgSum: number = 0;
    let sdSqSum: number = 0;
    let formStr: string = '';
    for (const [avgInp, action, avgStr, sdStr] of getInps()) {
        let result: number[] = getNums(avgInp, avgStr, sdStr);
        if (!result.shift()) return;
        const [avg, sd, isAns]: number[] = result;
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
    const sdSum: number = rndTo10(Math.sqrt(sdSqSum));
    avgSum = rndTo10(avgSum);
    postProc(formStr, avgSum, sdSum);
}


function calcMulDiv(): void {
    let avgProd: number = 1;
    let sdSqSum: number = 0;
    let formStr: string = '';
    for (const [avgInp, action, avgStr, sdStr] of getInps()) {
        let result: number[] = getNums(avgInp, avgStr, sdStr);
        if (!result.shift()) return;
        const [avg, sd, isAns]: number[] = result;
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
    const sdSum = rndTo10(avgProd * Math.sqrt(sdSqSum));
    avgProd = rndTo10(avgProd);
    postProc(formStr, avgProd, sdSum);
}


function calcLn(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = getInp();
    let result: number[] = getNums(avgInp, avgStr, sdStr);
    if (!result.shift()) return;
    const [avg, sd, isAns]: number[] = result;
    let avgRes: number = Math.log(avg);
    const sdRes: number = rndTo10(sd / avg);
    avgRes = rndTo10(avgRes);
    const formStr: string = `\\ln{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}


function calcLog(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = getInp();
    let result: number[] = getNums(avgInp, avgStr, sdStr);
    if (!result.shift()) return;
    const [avg, sd, isAns]: number[] = result;
    let avgRes: number = Math.log10(avg);
    const sdRes: number = rndTo10(sd / avg * Math.log10(Math.E));
    avgRes = rndTo10(avgRes);
    const formStr: string = `\\log{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}


function calcExp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = getInp();
    let result: number[] = getNums(avgInp, avgStr, sdStr);
    if (!result.shift()) return;
    const [avg, sd, isAns]: number[] = result;
    let avgRes: number = Math.exp(avg);
    const sdRes: number = rndTo10(sd * avgRes);
    avgRes = rndTo10(avgRes);
    const formStr: string = `e^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}


function calc10xp(): void {
    const [avgInp, avgStr, sdStr]: [HTMLInputElement, string, string] = getInp();
    let result: number[] = getNums(avgInp, avgStr, sdStr);
    if (!result.shift()) return;
    const [avg, sd, isAns]: number[] = result;
    let avgRes: number = Math.pow(10, avg);
    const sdRes: number = rndTo10(sd * avgRes * Math.log(10));
    avgRes = rndTo10(avgRes);
    const formStr: string = `10^{${isAns ? ansForm(avgStr) : numForm(avg, sd)}}`;
    postProc(formStr, avgRes, sdRes);
}