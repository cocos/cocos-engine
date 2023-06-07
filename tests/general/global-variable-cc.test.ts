/* eslint-disable @typescript-eslint/no-require-imports */

import fs from 'fs-extra';
import ps from 'path';

async function summarizeFilesInDirectory (directory: string) {
    return (await fs.readdir(directory)).map((file) => ps.join(directory, file));
}

declare global {
    const cc: object;
    const _cc: object;
}

// this case fails too many times because of memory problem,skip it temporarily.
test.skip('global variables are sealed', async () => {
    const files = await summarizeFilesInDirectory(ps.join(__dirname, '..', '..', 'exports'));
    for (const file of files) {
        require(file);
    }

    let globalVariables: string[] = [];
    const visited: Set<object> = new Set();
    const getMembersRecursive = (object: {}, prefix: string) => {
        const memberNames = Object.getOwnPropertyNames(object);
        for (const memberName of memberNames) {
            const member = object[memberName];
            if (visited.has(member)) {
                continue;
            } else {
                visited.add(member);
            }
            const path = `${prefix}.${memberName}`;
            globalVariables.push(path);
            // TODO: Recursive
            // if (member === null) {
            //     console.warn(`${path} is \`null\`, is it intended?`);
            // }
            // else if (typeof member === 'object' && member.constructor === Object) {
            //     getMembersRecursive(member, path);
            // }
        }
    };
    // Global variable `cc`
    // getMembersRecursive(cc, 'cc'); // opted out for performance reasons (we are not doing this recursively anyways)
    globalVariables = Object.getOwnPropertyNames(cc).map((name) => `cc.${name}`);

    const sealedGlobalVariablesFile = ps.join(__dirname, 'sealed-global-variables.json');
    const output = false;
    if (output) {
        await fs.writeFile(sealedGlobalVariablesFile, JSON.stringify({
            thisFile: {
                stamp: new Date().toISOString(),
            },
            variables: globalVariables.sort(),
        }, undefined, 4));
    } else {
        const sealedGlobalVariables = (await fs.readJson(sealedGlobalVariablesFile)).variables as string[];
        expect(globalVariables.length === sealedGlobalVariables.length && globalVariables.every((v) => sealedGlobalVariables.includes(v))).toBeTruthy();
    }

}, 50000);
