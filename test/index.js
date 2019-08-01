var tests = [
    'test-serialize',
    'test-env',
    'test-get-node-dump',
    'test-runtime-helpers',
    'test-set-property-by-path',
    'test-behavior',
    'page',
    'core'
];

module.exports = tests.map(function (entry) { return entry + '.js'; });
