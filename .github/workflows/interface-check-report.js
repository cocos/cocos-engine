const ps = require('path');
const fs = require('fs');

const interfaceDiffPath = ps.join(__dirname, '../../interface-diff.txt');
let reportContent = fs.readFileSync(interfaceDiffPath, 'utf8');

// Remove the first line that show the package size.
const firstLineEnd = reportContent.indexOf('\n');
const packageSizeIncreasePrompt = reportContent.substring(0, firstLineEnd);
reportContent = reportContent.substring(firstLineEnd + 1);
//

if (reportContent.includes('@')) {
    reportContent = reportContent.split('\n').slice(3).join('\n');
    reportContent = `## ${packageSizeIncreasePrompt}

## Interface Check Report
\`\`\`diff
! WARNING this pull request has changed these public interfaces:

${reportContent}
\`\`\`
`;
} else {
    reportContent = `## ${packageSizeIncreasePrompt}

## Interface Check Report
This pull request does not change any public interfaces !`;
}

fs.writeFileSync(interfaceDiffPath, reportContent, 'utf8');
