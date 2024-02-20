import { getSymbolAt,getSymbolLength,getSymbolCodeAt } from "../../cocos/2d/utils/text-utils";
test('getSymbolLength', function () {
    let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
    expect(getSymbolLength('')).toEqual(0);
    expect(getSymbolLength('w')).toEqual(1);
    expect(getSymbolLength('中')).toEqual(1);
    expect(getSymbolLength('👨‍👩‍👧‍👦')).toEqual(1);
    expect(getSymbolLength(txt)).toEqual(6);
});

test('getSymbolAt', function () {
    let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
    expect(getSymbolAt('', 0)).toStrictEqual('');
    expect(getSymbolAt(txt, 0)).toStrictEqual('w');
    expect(getSymbolAt(txt, 1)).toStrictEqual('大');
    expect(getSymbolAt(txt, 2)).toStrictEqual('熊');
    expect(getSymbolAt(txt, 3)).toStrictEqual('🐻');
    expect(getSymbolAt(txt, 4)).toStrictEqual('👨‍👩‍👧‍👦');
    expect(getSymbolAt(txt, 5)).toStrictEqual('🐼');
    
});

test('getSymbolCodeAt', function () {
    let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
    expect(getSymbolCodeAt(txt, 0)).toStrictEqual('119');
    expect(getSymbolCodeAt(txt, 1)).toStrictEqual('22823');
    expect(getSymbolCodeAt(txt, 2)).toStrictEqual('29066');
    //  emoji = utf-16 encoding = decimal = output result
    //  🐻 = 0xDB3D 0xDC38 = 55357 56379 = 5535756379;
    //  👨‍👩‍👧‍👦 = 0xDB3D 0xDC68 0x200D 0xDB3D 0xDC69 0x200D 0xDB3D 0xDC67 0x200D 0xDB3D 0xDC66 = 55357 56424 8205 55357 56425 8205 55357 56423 8205 55357 56422 = 5535756424820555357564258205553575642382055535756422;
    //  🐼 = 0xDB3D 0xDC3C = 55357 56380 = 5535756380
    expect(getSymbolCodeAt(txt, 3)).toStrictEqual('5535756379'); // 🐻
    expect(getSymbolCodeAt(txt, 4)).toStrictEqual('5535756424820555357564258205553575642382055535756422'); // 👨‍👩‍👧‍👦
    expect(getSymbolCodeAt(txt, 5)).toStrictEqual('5535756380'); // 🐼
});

// The following test cases are closed because the test interfaces are not exported.
// test('getSymbolStartIndex', function () {
//     let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
//     expect(getSymbolStartIndex(txt, 0)).toEqual(0);
//     expect(getSymbolStartIndex(txt, 1)).toEqual(1);
//     expect(getSymbolStartIndex(txt, 2)).toEqual(2);

//     expect(getSymbolStartIndex(txt, 3)).toEqual(3);
//     expect(getSymbolStartIndex(txt, 4)).toEqual(3);

//     expect(getSymbolStartIndex(txt, 5)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 6)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 7)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 8)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 9)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 10)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 11)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 12)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 13)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 14)).toEqual(5);
//     expect(getSymbolStartIndex(txt, 15)).toEqual(5);

//     expect(getSymbolStartIndex(txt, 16)).toEqual(16);
//     expect(getSymbolStartIndex(txt, 17)).toEqual(16);
//     expect(getSymbolStartIndex(txt, 18)).toEqual(txt.length);
// });

// test('getSymbolEndIndex', function () {
//     let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
//     expect(getSymbolEndIndex(txt, 0)).toEqual(0);
//     expect(getSymbolEndIndex(txt, 1)).toEqual(1);
//     expect(getSymbolEndIndex(txt, 2)).toEqual(2);

//     expect(getSymbolEndIndex(txt, 3)).toEqual(4);
//     expect(getSymbolEndIndex(txt, 4)).toEqual(4);

//     expect(getSymbolEndIndex(txt, 5)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 6)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 7)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 8)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 9)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 10)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 11)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 12)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 13)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 14)).toEqual(15);
//     expect(getSymbolEndIndex(txt, 15)).toEqual(15);

//     expect(getSymbolEndIndex(txt, 16)).toEqual(17);
//     expect(getSymbolEndIndex(txt, 17)).toEqual(17);
//     expect(getSymbolEndIndex(txt, 18)).toEqual(txt.length);
// });

// test('_safeSubstring', function () {
//     let txt = 'w大熊🐻👨‍👩‍👧‍👦🐼';
//     expect(_safeSubstring(txt, 0)).toStrictEqual(txt);
//     expect(_safeSubstring(txt, 1)).toStrictEqual('大熊🐻👨‍👩‍👧‍👦🐼');
//     expect(_safeSubstring(txt, 2)).toStrictEqual('熊🐻👨‍👩‍👧‍👦🐼');
//     expect(_safeSubstring(txt, 3)).toStrictEqual('🐻👨‍👩‍👧‍👦🐼');
//     expect(_safeSubstring(txt, 4)).toStrictEqual('👨‍👩‍👧‍👦🐼');
//     expect(_safeSubstring(txt, 5)).toStrictEqual('👨‍👩‍👧‍👦🐼');
//     expect(_safeSubstring(txt, 6)).toStrictEqual('🐼');
//     expect(_safeSubstring(txt, 16)).toStrictEqual('🐼');
//     expect(_safeSubstring(txt, 17)).toStrictEqual('');

//     expect(_safeSubstring(txt, 0, 1)).toStrictEqual('w');
//     expect(_safeSubstring(txt, 1, 2)).toStrictEqual('大');
//     expect(_safeSubstring(txt, 1, 3)).toStrictEqual('大熊');
//     expect(_safeSubstring(txt, 3, 4)).toStrictEqual('🐻');
//     expect(_safeSubstring(txt, 3, 5)).toStrictEqual('🐻');
//     expect(_safeSubstring(txt, 4, 6)).toStrictEqual('👨‍👩‍👧‍👦');
//     expect(_safeSubstring(txt, 8, 12)).toStrictEqual('');
//     expect(_safeSubstring(txt, 4, 3)).toStrictEqual('');
//     expect(_safeSubstring(txt, 15, 8)).toStrictEqual('');

//     let txt1 = '😉🚗';
//     expect(_safeSubstring(txt1, 1)).toStrictEqual('🚗');
//     expect(_safeSubstring(txt1, 0, 1)).toStrictEqual('😉');
//     expect(_safeSubstring(txt1, 0, 2)).toStrictEqual('😉');
//     expect(_safeSubstring(txt1, 0, 3)).toStrictEqual('😉🚗');
//     expect(_safeSubstring(txt1, 0, 4)).toStrictEqual('😉🚗');
//     expect(_safeSubstring(txt1, 1, 2)).toStrictEqual('');
//     expect(_safeSubstring(txt1, 1, 3)).toStrictEqual('🚗');
//     expect(_safeSubstring(txt1, 2, 3)).toStrictEqual('🚗');
//     expect(_safeSubstring(txt1, 2, 4)).toStrictEqual('🚗');
// });