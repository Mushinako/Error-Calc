"use strict";

/** 
 * Error propagation main functions
 * 
 * - Initializer
 * - Keyboard shortcuts
 */

// Global variables
let btnsDiv: HTMLDivElement;
let propInpsDiv: HTMLDivElement;
let sigFigInp: HTMLInputElement;
let sigFig2Inp: HTMLInputElement;
let sigFig: boolean;
let sigFig2: boolean;

/**
 * Error propagation keyboard shortcuts
 * 
 * @param {KeyboardEvent} ev - Keyboard event
 */
function keyProp(ev: KeyboardEvent): void {
    // No Alt, Win/Cmd, or Ctrl allowed
    if (ev.altKey || ev.metaKey || ev.ctrlKey) return;
    if (ev.key === 'Enter' || ev.key === '\n') {
        if (ev.shiftKey) {
            // Shift+Enter: Run calculation
            ev.preventDefault();
            (<HTMLAnchorElement>document.getElementById('calc')).click();
        }
        return;
    }
    // No shift allowed
    if (ev.shiftKey) return;
    if (ev.key.toLowerCase() === 'q') {
        // q: Add row
        ev.preventDefault();
        if (!['as', 'md'].includes(mode)) return;
        const addRowBtn: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById('propaddrow');
        addRowBtn.click();
        return;
    }
    if (ev.key.toLowerCase() === 'w') {
        // w: Remove row
        ev.preventDefault();
        if (!['as', 'md'].includes(mode)) return;
        const rows: NodeListOf<ChildNode> = propInpsDiv.childNodes[0].childNodes;
        const inpRow: ChildNode = rows[rows.length - 2];
        if (inpRow.childNodes.length < 3) return;
        const btn: HTMLAnchorElement = <HTMLAnchorElement>inpRow.childNodes[2].childNodes[0];
        btn.click();
        return;
    }
    if (ev.key.toLowerCase() === 'z') {
        // z: Remove last result
        ev.preventDefault();
        if (!outDiv.hasChildNodes() || !confirm('Do you want to delete the last result?')) return;
        const tbody: ChildNode = outDiv.childNodes[0].childNodes[1];
        const lastRes: ChildNode = tbody.lastChild!;
        const btn: HTMLAnchorElement = <HTMLAnchorElement>lastRes.lastChild!.childNodes[0];
        btn.click();
        return;
    }
    if (ev.key.toLowerCase() === 's') {
        // s: 'Calculate SigFigs' switch
        ev.preventDefault();
        sigFigInp.checked = !sigFigInp.checked;
        sigFig2Inp.disabled = !sigFigInp.checked;
        displayAns();
        return;
    }
    if (ev.key.toLowerCase() === 'd') {
        // d: '2 more SigFigs' switch
        ev.preventDefault();
        if (sigFig2Inp.disabled) return;
        sigFig2Inp.checked = !sigFig2Inp.checked;
        displayAns();
        return;
    }
    const funcKeys: string[] = ['h', 'j', 'k'];
    const funcI: number = funcKeys.indexOf(ev.key.toLowerCase());
    if (funcI > -1) {
        // b-m: Functions
        ev.preventDefault();
        const btns: HTMLElement[] = ['prop', 'stat', 'lreg'].map((val: string): HTMLElement => <HTMLElement>document.getElementById(val));
        (<HTMLAnchorElement>btns[funcI]).click();
        return;
    }
    const methodKeys: string[] = ['r', 't', 'y', 'u', 'i', 'o', 'p'];
    const methodI: number = methodKeys.indexOf(ev.key.toLowerCase());
    if (methodI > -1) {
        // r-p: Methods
        ev.preventDefault();
        const btnNodes: NodeListOf<ChildNode> = btnsDiv.childNodes;
        const btns: ChildNode[] = Array.from(btnNodes).filter((val: ChildNode): boolean => {
            const tn: string = (<Element>val).tagName;
            if (tn === undefined) return false;
            return tn.toLowerCase() === 'a';
        });
        (<HTMLAnchorElement>btns[methodI]).click();
        return;
    }
}

/**
 * Initialize propagation calculation interface
 */
function propInit(): void {
    // Keyboard events
    document.addEventListener('keypress', keyProp);
    document.removeEventListener('keypress', keyStat);
    document.removeEventListener('keypress', keyLreg);
    // Clear input div
    clearChildren(inDiv);
    clearChildren(outDiv);
    clearChildren(helpDiv);
    // Title
    const ttlElmt: HTMLHeadingElement = createTtl('Error Propagation')
    inDiv.appendChild(ttlElmt);
    // Method buttons
    btnsDiv = document.createElement('div');
    btnsDiv.classList.add('center', 'margin-bottom');
    setBtns(copers, btnsDiv);
    setBtns(nopers, btnsDiv);
    setBtns(topers, btnsDiv);
    inDiv.appendChild(btnsDiv);
    // Add divider
    appendHr(inDiv);
    // Set input
    propInpsDiv = document.createElement('div');
    inDiv.appendChild(propInpsDiv);
    // Add divider
    appendHr(inDiv);
    // Switches
    const switches: HTMLDivElement = createSwitches();
    inDiv.appendChild(switches);
    // Help
    const notes: string[] = [
        'All the results are stored locally, meaning that all data will be lost if the site data for this webpage is cleared',
        'All variables are assumed to be independent of one another',
        'Use respective answer (e.g., \"Err1\", \"Var2\", \"Lin3\", etc.) as the average to use previously calculated values for better precision',
        'Use \"×/÷\" to calculate reciprocals. Put the number on the first line, choose \"÷\", remove the second line, and hit \"Calculate\"',
        'To calculate SigFigs, use appropriate SigFigs in the input (e.g., \"3.0\" instead of \"3\")'
    ];
    const shortcuts: Record<string, string> = {
        'Enter': 'Open dropdown (when applicable); Confirm choice (when applicable)',
        'Shift+Enter': 'Run calculation',
        'Tab': 'Next input/element',
        'Shift+Tab': 'Previous input/element',
        '↓': 'Next dropdown choice',
        '↑': 'Previous dropdown choice',
        'q': 'Add row (when applicable)',
        'w': 'Remove row (when applicable)',
        's': 'Change \"Calculate SigFigs\" switch',
        'd': 'Change \"2 more SigFigs\" switch',
        'z': 'Remove last result (if any)',
        'h': 'Change to \"Err Prop\" calculations (no use)',
        'j': 'Change to \"1-Var Stat\" calculation',
        'k': 'Change to \"Lin Reg\" calculation',
        'r': 'Change mode to \"+/-\"',
        't': 'Change mode to \"×/÷\"',
        'y': 'Change mode to \"ln\"',
        'u': 'Change mode to \"log\"',
        'i': 'Change mode to \"e^\"',
        'o': 'Change mode to \"10^\"',
        'p': 'Change mode to \"a^x\"'
    };
    const formats: Record<string, string[]> = {
        'Numbers': ['3.1415926', '-2020', '.57721'],
        'E-notations': ['8e7', '.9109383e-30', '1.416808e32'],
        'Previous Answers': ['Err1', 'Var3', 'Lin15']
    };
    const formatNote: string[] = ['All empty inputs are treated as 0'];
    const noteLi: HTMLLIElement = noteGen(notes);
    const shortcutsLi: HTMLLIElement = shortcutGen(shortcuts);
    const formatLi: HTMLLIElement = formatGen(formats, formatNote);
    const helpUl: HTMLUListElement = helpGen(noteLi, shortcutsLi, formatLi);
    helpDiv.appendChild(helpUl);
    // Init +/-
    (<HTMLAnchorElement>btnsDiv.childNodes[1]).click();
    // Display saved answers
    displayAns();
}
