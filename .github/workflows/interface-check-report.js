const ps = require('path');
const fs = require('fs');

const interfaceDiffPath = ps.join(__dirname, '../../interface-diff.txt');
let reportContent = fs.readFileSync(interfaceDiffPath, 'utf8');

if (reportContent.includes('@')) {
    reportContent = reportContent.split('\n').slice(3).join('\n');
    reportContent = `## Interface Check Report
\`\`\`diff
! WARNING this pull request has changed these public interface:

${reportContent}
\`\`\`
`;
} else {
    reportContent = `## Interface Check Report
This pull request does not change any public interface !`;
}
fs.writeFileSync(interfaceDiffPath, reportContent, 'utf8');
