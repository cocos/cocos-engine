const { ir } = require('import-redirect')
const ps = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk').default;

inquirer.prompt([
    {
        name: 'moduleName',
        type: 'input',
        message: `Please enter the module name you want to recast:`,
    },
    {
        name: 'moduleIndex',
        type: 'input',
        message: `Please enter the path of module index file:`,
        validate (input) {
            if (!ps.isAbsolute(input)) {
                input = ps.join(process.cwd(), input);
            }
            if (!fs.existsSync(input)) {
                return `No such file or directory: ${input}`;
            }
            if (fs.statSync(input).isDirectory()) {
                return `This should be a file instead of a directory: ${input}`;
            }
            return true;
        }
    },
    {
        name: 'confirm',
        type: 'confirm',
        message: 'This command would override the files in your engine repository, are you sure ?',
        prefix: chalk.red('DANGER'),
    }
]).then(answers => {
    if (answers.confirm) {
        console.log(chalk.green('Start to recast the import statement in your repo, please wait...'));

        let { moduleName, moduleIndex } = answers;
        if (!ps.isAbsolute(moduleIndex)) {
            moduleIndex = ps.join(process.cwd(), moduleIndex);
        }
        console.log(chalk.green(`module name: ${moduleName}\n module index path: ${moduleIndex}`));

        console.log('Scanning files...')
        const engineDir = ps.join(__dirname, '..');
        const res = ir.transformPatternImport({
            moduleIndex: moduleIndex.replace(/\\/g, '/'),
            moduleName,
            mergeSpecifier: true,
            pattern: ps.join(engineDir, '/**/*.ts').replace(/\\/g, '/'),
            ignorePatterns: [
                '**/node_modules/**/*',
                '**/templates/**/*',
                '**/native/**/*',
            ],
            verbose: true,
        });
        
        console.log('Overriding files...')
        for (let fileName in res) {
            const content = res[fileName];
            fs.writeFileSync(fileName, content, 'utf8')
        }
        
        console.log('finish !')
    } else {
        console.log(chalk.yellow('skip the import recast, nothing happens'));
    }
})
