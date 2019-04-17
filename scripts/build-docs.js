(function buildingDocs () {
    let [index, out] = process.argv.slice(3);
    const { spawn } = require('child_process');

    let options = {
        indexPath: index || `${process.cwd()}\\index.ts`,
        mode: 'modules',
        out: out || `${process.cwd()}\\docs-3d`,
        name: 'Creator-3D-Docs'
    };

    // typedoc command
    let command = [
        options.indexPath,
        '--mode', options.mode,
        '--ignoreCompilerErrors',
        '--disableOutputCheck',
        '--includeDeclarations',
        '--name',
        options.name,
        '--out',
        options.out];

    let child = spawn('typedoc', command, {
        shell: true,
        env: process.env,
    });

    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });
    child.stderr.on('data', function (data) {
        console.error(`${data}`);
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log('Building Failed!');
            return;
        }
        console.log('Building Success!');
    });
})();
