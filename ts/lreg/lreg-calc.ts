"use strict";

/**
 * Linear regression calculation functions
 *
 * - Calculation
 */

/**
 * Sanitize linear regression input
 *
 * @param   {string} inpStr - Raw input string from textarea
 * @returns {string[][]}    - Parsed values
 * @returns {string[]}      - Parsed inputs
 */
function lregSanInp(inpStr: string): [string[][], string[]] {
    const inps: string[] = inpStr.split('\n').filter((val: string): boolean => val !== '' && val.charAt(0).toLowerCase() !== 'e');
    let sanVals: string[][] = [];
    const sanInps: string[] = [];
    for (const inp of inps) {
        if (inp.slice(0, 3) === 'Lin') {
            // Ans
            const parsedAnsKey: RegExpExecArray | null = /^(Lin\d+)(?:\D|$)/.exec(inp);
            if (parsedAnsKey === null) {
                alert(`\"${inp}\" is not a parsable previous answer!`);
                continue;
            }
            const ansKey: string = parsedAnsKey[1];
            const ans: string | null = window.localStorage.getItem(ansKey);
            if (ans === null) {
                alert(`\"${ansKey}\" does not exist!`);
                continue;
            }
            const formula: string = JSON.parse(ans)[0];
            const points: string[] = formula.split(';');
            const nums: string[][] = points.map((val: string): string[] => val.slice(1, val.length - 1).split(','));
            sanVals = sanVals.concat(nums);
            sanInps.push(ansKey);
        } else if (['Err', 'Var'].includes(inp.slice(0, 3))) {
            alert('\"Err\" and \"Var\" are not allowed!');
            continue;
        } else {
            // No ans
            const parsed: RegExpExecArray | null = /^([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)[ \t]+([\+\-]?\d*(?:\.\d*)?(?:[Ee][\+\-]?\d+)?)(?:\D|$)/.exec(inp);
            if (parsed === null) continue;
            const parsedVals: string[] = [parsed[1], parsed[2]];
            if (parsedVals.includes('')) continue;
            sanVals.push(parsedVals);
            sanInps.push(`(${parsedVals.join(',')})`);
        }
    }
    return [sanVals, sanInps];
}

/**
 * Calculate linear regression
 */
function lregCalc(): void {
    // Get input
    const inpStr: string = lregInp.value;
    // Sanitize input
    const [sanValStrs, sanInpStrs]: [string[][], string[]] = lregSanInp(inpStr);
    if (!sanInpStrs.length) {
        alert('No valid input!');
        return;
    }
    const check: boolean = sanInpStrs.length === 1 && sanInpStrs[0].slice(0, 3) === 'Lin';
    // Show parsed output
    for (const vars of sanValStrs) {
        const tr: HTMLTableRowElement = document.createElement('tr');
        lregInp2.appendChild(tr);
        for (const v of vars) {
            const td: HTMLTableCellElement = document.createElement('td');
            td.textContent = v;
            tr.appendChild(td);
        }
    }
    const name: string = `Var${ansCounter}`;
    if (!check) {
        const p: HTMLParagraphElement = document.createElement('p');
        p.textContent = `(Saved as \"${name}\")`;
        lregInp2.parentElement!.parentElement!.appendChild(p);
    }
}