import fs from 'fs-extra';
import ps from 'path';

async function summarizeFilesInDirectory (directory: string) {
    return (await fs.readdir(directory)).map((file) => ps.join(directory, file));
}

declare global {
    const cc: object;
    const _cc: object;
}

test('global variables are sealed', async () => {
    const files = await summarizeFilesInDirectory(ps.join(__dirname, '..', '..', 'exports'));
    for (const file of files) {
        require(file);
    }

    const globalVariables: string[] = [];
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
    getMembersRecursive(cc, 'cc');

    const sealedGlobalVariablesFile = ps.join(__dirname, 'sealed-global-variables.json');
    const output = false; // DO NOT CHANGE THIS PROPERTY EXCEPT IF YOU KNOW WHAT ARE YOU DOING.
    if (output) {
        // Update the sealed-global-variables.json.
        // Please take care.
        await fs.writeFile(sealedGlobalVariablesFile, JSON.stringify({
            thisFile: {
                stamp: new Date().toISOString(),
            },
            variables: globalVariables,
        }, undefined, 4));
    } else {
        const sealedGlobalVariables: string[] = (await fs.readJson(sealedGlobalVariablesFile)).variables;
        for (const globalVariable of globalVariables) {
            expect(sealedGlobalVariables).toContain(globalVariable);
        }
    }

}, 5000);