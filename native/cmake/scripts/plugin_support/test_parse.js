

const parser = require('./plugin_cfg.js');
const input_text = `3.4.x 3.5 3 3.* * 6.2.* || > 3.5 <= 3.2 > 2.4 <= 33.2 >=133.222.2 !333 != 22 || 4`;

// let r = parser.parse(input_text);



function assert(label, blk) {
    console.log(`run ${label}`);
    let r = blk();
    if (!r) {
        console.error(`  failed!`);
    }
}

// r.match("3.2");
// r.match("3.4");
{
    let vs = ["3.4", "3.4.*", "3.4.x", "3.4.X"];
    for (let v of vs) {
        let s = parser.parse(v);
        let label = `Simple match ${v}`;
        assert(`${label} 1`, () => {
            return s.match("3.4");
        });
        assert(`${label} 2`, () => {
            return !s.match("3.2");
        });
        assert(`${label} 2`, () => {
            return s.match("3.4.3");
        });
        assert(`${label} 3`, () => {
            return s.match("3.4.6");
        });
        assert(`${label} 4`, () => {
            return !s.match("3.444");
        });
        assert("dont match", () => {
            let cases = [
                "2.4",
                "2.4.2",
                "6.4",
                "3"
            ]
            return !cases.reduce((p, cs) => p || s.match(cs), false);
        });
    }
}
{
    let s = parser.parse("*");
    assert("match all", () => {
        let cases = [
            "2.4",
            "2.4.2",
            "6.4",
            "3"
        ]
        return cases.reduce((p, cs) => p && s.match(cs), true);
    });
}
{
    function assert_match(target, versions, bad_versions) {
        let s = parser.parse(target);
        for (let v of versions) {
            assert(`test ${v}`, () => {
                return s.match(v);
            });
        }
        for (let v of bad_versions) {
            assert(`test not match ${v}`, () => {
                return !s.match(v);
            });
        }
    }
    assert_match(">3.3 <3.6", [
        '3.4',
        '3.4.1',
        '3.4.2',
        '3.5',
        '3.5.0',
        '3.5.1',
        '3.5.2',
    ],
        [
            '3.3',
            '3.3.2',
            '2.3',
            '3.6.0',
            '3.6',
        ]
    );
    assert_match(">=3.3 <= 3.6.0", [
        '3.3.0',
        '3.3.1',
        '3.4',
        '3.4.1',
        '3.4.2',
        '3.5',
        '3.5.0',
        '3.5.1',
        '3.5.2',
        '3.6.0'
    ],
        [
            '3.2.9',
            '2.3',
            '3.6.1',
        ]
    );
    assert_match(">=3.3 <= 3.6.0 !3.5.2|| 4.x", [
        '3.3.0',
        '3.3.1',
        '3.4',
        '3.4.1',
        '3.4.2',
        '3.5',
        '3.5.0',
        '4.0',
        '4.1',
        '4.2',
        '3.5.1',
        '3.6.0'
    ],
        [
            '3.2.9',
            '2.3',
            '3.6.1',
            '3.5.2'
        ]
    );
}