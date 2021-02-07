/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export default async (rows: Array<any>, header: any, options: any) => {
    let maxSpace = options.maxSpace;
    let table = null;
    let language = options.language || "css";
    let _header = "";
    let _rows = [];
    let _row = [];
    for (let thisObject of rows) {
        for await (let key of Object.keys(thisObject)) {
            let element = thisObject[key];
            if (_row.length + 1 !== Object.keys(thisObject).length) {
                element = element.slice(0, maxSpace);
                let spaces = maxSpace - element.length;
                for (let x = 0; x < spaces; x++) {
                    element = `${element}` + ` `;
                }
            }
            _row.push(element);
            if (_row.length === Object.keys(thisObject).length) {
                _rows.push(_row);
                _row = [];
            }
        }
    }
    for await (let element of header) {
        element = element.slice(0, maxSpace);
        let spaces = maxSpace - element.length;
        for (let x = 0; x < spaces; x++) {
            element = `${element}` + ` `;
        }
        _header = `${_header}` + `${element}`;
    }
    table = _rows.map(row => row.join("")).join("\n");
    table = `\`\`\`${language}\n${_header}\n \n${table}\`\`\``;
    return table;
}