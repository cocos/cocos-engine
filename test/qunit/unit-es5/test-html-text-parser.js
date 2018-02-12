/*global test, deepEqual, largeModule, strictEqual */

largeModule('HtmlTextParser');

var parser = new cc._Test.HtmlTextParser();

test('Basic Test', function() {

    var testStr1 = "hello world";
    deepEqual(parser.parse(testStr1),
                [{text: "hello world"}],
                'No Html string should be equal to original.');

    var testInvalidStr2 = "<x hello world";
    deepEqual(parser.parse(testInvalidStr2),
              [{text: "x hello world"}],
              'Invalid tag begin.');

    var testInvalidStr1 = "<x>hello world</x>";
    deepEqual(parser.parse(testInvalidStr1),
              [{text: "hello world", style: {}}],
                'Invalid tags');


    var testInvalidStr3 = "</b>hello world";
    deepEqual(parser.parse(testInvalidStr3),
              [{text: "hello world"}],
               "invalid tags end.");

    var testInvalidStr4 = "</>hello world";
    deepEqual(parser.parse(testInvalidStr4),
              [{text: "hello world"}],
             "Empty tags are emitted.");

    var testInvalidStr5 = "<b>hello world";
    deepEqual(parser.parse(testInvalidStr5),
              [{text: "hello world"}],
              "Empty tags are emitted.");
});




test('Color test', function(){
    var colorTestStr1 = "<color=#0xffff00>hello world</color>";
    deepEqual(parser.parse(colorTestStr1),
              [{text: "hello world", style: {color: "#0xffff00"}}],
              "Happy path.");

    var colorTestStr2 = "<color=#0xffff33>hello world</xxx>";
    deepEqual(parser.parse(colorTestStr2),
              [{text: "hello world", style: {color: "#0xffff33"}}],
              "Happy path two.");

    var colorTestStr3 = "<color#0xffff33>hello world</xxx>";
    deepEqual(parser.parse(colorTestStr3),
              [{text: "hello world", style: {}}],
              "Missing the = sign.");

    var colorTestStr4 = "<color=>hello world</xxx>";
    deepEqual(parser.parse(colorTestStr4),
              [{text: "hello world", style: {}}],
              "missing the color value.");

    var colorTestStr5 = "<c=#0xff4400>hello world</xxx>";
    deepEqual(parser.parse(colorTestStr5),
              [{text: "hello world", style: {}}],
              "tag name is invalid");

    var colorTestStr6 = "<color = #0xff4400>hello world";
    deepEqual(parser.parse(colorTestStr6),
              [{text: "hello world"}],
              "The close tag is missing.");


});

test('Size test', function() {
    var sizeTestStr1 = "<size = 20>hello world</size>";
    deepEqual(parser.parse(sizeTestStr1),
              [{text: "hello world", style: {size: 20}}],
              "Happy path 1.");

    var sizeTestStr2 = "<size = 20>hello world</xx>";
    deepEqual(parser.parse(sizeTestStr2),
              [{text: "hello world", style: {size: 20}}],
              "Happy path 2.");

    var sizeTestStr3 = "<size20>hello world</xxx>";
    deepEqual(parser.parse(sizeTestStr3),
              [{text: "hello world", style: {}}],
              "Missing the = sign.");

    var sizeTestStr4 = "<size=>hello world</xxx>";
    deepEqual(parser.parse(sizeTestStr4),
              [{text: "hello world", style: {}}],
              "missing the color value.");

    var sizeTestStr5 = "<s=20>hello world</xxx>";
    deepEqual(parser.parse(sizeTestStr5),
              [{text: "hello world", style: {}}],
              "tag name is invalid");

    var sizeTestStr6 = "<size=20>hello world";
    deepEqual(parser.parse(sizeTestStr6),
              [{text: "hello world"}],
              "The close tag is missing.");


});

test('Event test', function() {
    var eventTestString = "<on click=' event1' hoverin='event2 ' hoverout = 'event3'>hello world</on>";

    deepEqual(parser.parse(eventTestString),
              [{text: "hello world", style: {
                  event: {
                  click : "event1"
                  }}}], "Happy path 1");

    var eventTestStringFail1 = "<on click=' event1' hoverin'event2 ' hoverout=event3>hello world</on>";

    deepEqual(parser.parse(eventTestStringFail1),
              [{text: "hello world", style: {
                  event: {
                      click : "event1",
                  }}}], "Fail path 1");

    var eventTestStringFail2 = "<size=20 click=' event1' hoverin=event2 hoverout:event3>hello world</on>";

    deepEqual(parser.parse(eventTestStringFail2),
              [{text: "hello world", style: {
                  size: 20,
                  event: {
                      click : "event1",
                  }}}], "Fail path 2");

    var eventTestStringFail3 = "<size=20 click=event1 hoverin='event2' hoverout:event3>hello world</on>";

    deepEqual(parser.parse(eventTestStringFail3),
              [{text: "hello world", style: {
                  size: 20,
                  event: {
                  }}}], "Fail path 3");


    var eventTestString2 = "<color=#0xff0000 click=\"event1\">Super weapon</color>";

    deepEqual(parser.parse(eventTestString2),
              [{text: "Super weapon", style: {
                  color: "#0xff0000",
                  event: {
                  click : "event1",
                  }
              }}], "Color with event");

    var eventTestString3 = "<size=20 click='event1' hoverin='event2'>hello world</>";
    deepEqual(parser.parse(eventTestString3),
              [{text: "hello world",
                style: {
                    size: 20,
                    event: {
                        click : "event1",
                    }
                }}], "Size with event");

    var eventTestString4 = "<sie=20 click='event1' hoverin='event2'>hello world</>";
    deepEqual(parser.parse(eventTestString4),
              [{text: "hello world",
                style: {}
               }], "Failed path: Size with event");

    var invalidEventTestString4 = "<size=20 click='event1\">hello world</>";
    deepEqual(parser.parse(invalidEventTestString4),
              [{text: "hello world",
                style: {size: 20,
                        event: {}}
               }], "Failed path: event name quote not match.");

    var invalidEventTestString5 = "<size=20 click=\"event1'>hello world</>";
    deepEqual(parser.parse(invalidEventTestString5),
              [{text: "hello world",
                style: {size: 20,
                        event: {}}
               }], "Failed path: event name quote not match.");


});

test('Test special symbol escape', function() {
    var testLessThan = "<size=20>hello&lt;world</size>";

    deepEqual(parser.parse(testLessThan),
                [ {text: "hello<world",
                   style: {
                       size: 20
                   }
                  }],
                "The &lt; symbol should be correctly escaped.");

    var testGreatThan = "<on click='event1'> hello&gt;world</on>";
    deepEqual(parser.parse(testGreatThan),
                [{text: " hello>world",
                  style: {
                      event: {
                          click: 'event1'
                      }
                  }}],
                "The &gt; symbol should be correctly escaped.");

    var testAmp = "<color=#0xff00>hello&amp;world</>";
    deepEqual(parser.parse(testAmp),
              [{text: "hello&world",
                style: {
                    color: "#0xff00"
                }}],
                "The amp symbol should be correctly escaped.");

    var testQuot = "<on>hello&quot;world</on>";
    deepEqual(parser.parse(testQuot),
              [{text: "hello\"world",
                style: {}}],
                "The quot symbol should be correctly escaped.");

    var testApos = "<color=#0xffee>Hi, <size=20>hello&apos;world</s></c>";
    deepEqual(parser.parse(testApos),
              [{text: "Hi, ",
                style: {
                    color: "#0xffee"
                }},
               {text: "hello'world",
                style: {
                    color: "#0xffee",
                    size: 20
                }}],
                "The apos symbol should be correctly escaped.");
});


test('Integrate test', function() {
    var eventTestString = "hello <b>world</b>, <color=#0xff0000> Ni hao </color>";

    deepEqual(parser.parse(eventTestString),
              [{text: "hello "}, {text: "world", style: {bold: true}},
               {text: ", "},
               {text: " Ni hao ", style : {color: "#0xff0000"}}], "Happy path 1");

    var moreComplexString = "<size=20>大小<size=10>不一</size></size>,<color=#0xffeeaa>颜色</c><color=#0xffaaee>不同</c><on click='event1'>可点击</on>";
    deepEqual(parser.parse(moreComplexString),
              [{text: "大小", style: {size: 20}}, {text: "不一", style: {size: 10}}, {text:","},
               {text: "颜色", style: {color: "#0xffeeaa"}}, {text: "不同", style: {color: "#0xffaaee"}},
               {text: "可点击", style: {event: {click: 'event1'}}}], "more complex test");


});

test('bold/italic/underline test', function () {
    var stringWithBold = "<b></i><b>hello \n world</b>";

    deepEqual(parser.parse(stringWithBold),
              [{text: "hello \n world", style: {bold: true}}], "bold test");

    var stringWithItalic = "<i>hello world</i>";

    deepEqual(parser.parse(stringWithItalic),
              [{text: "hello world", style: {italic: true}}], "italic test");

    var stringWithUnderline = "<u>hello world</u>";

    deepEqual(parser.parse(stringWithUnderline),
              [{text: "hello world", style: {underline: true}}], "underline test");
});

test('test br tag', function () {
    var newlineTest = "<br/>";

    deepEqual(parser.parse(newlineTest),
              [{text: "", style: {newline: true}},], "newline element test");

    var newlineTest2 = "hello <b>a< br  /></b> world";

    deepEqual(parser.parse(newlineTest2),
              [{text: "hello "},
               {text: "a", style: {bold: true}},
               {text: "", style: {newline: true}},
               {text: " world"}
              ], "newline element test");

    var newlineTest3 = "< br />";

    deepEqual(parser.parse(newlineTest3),
              [{text: "", style: {newline: true}},], "newline element test");

    var newlineTest4 = "<br></br>";

    deepEqual(parser.parse(newlineTest4),
              [], "newline element test");

    var newlineTest5 = "hello <b>a<br></></b> world";

    deepEqual(parser.parse(newlineTest5),
              [{text: "hello "},
               {text: "a", style: {bold: true}},
               {text: " world"}
              ], "newline element test");

    var newlineTest6 = "hello <b>a<br /><br/ ></b> world";

    deepEqual(parser.parse(newlineTest6),
              [{text: "hello "},
               {text: "a", style: {bold: true}},
               {text: "", style: {newline: true}},
               {text: "", style: {newline: true}},
               {text: " world"}
              ], "newline element test");

    var newlineTest7 = "hello <b>a</b><br /><br/ >world";

    deepEqual(parser.parse(newlineTest7),
              [{text: "hello "},
               {text: "a", style: {bold: true}},
               {text: "", style: {newline: true}},
               {text: "", style: {newline: true}},
               {text: "world"}
              ], "newline element test");
});

test('test image tag', function () {
    var imageTest1 = "<img src='weapon' />";

    deepEqual(parser.parse(imageTest1),
              [
                  {text: "",
                   style: {isImage: true, src: "weapon"}}
              ], "image element test 1");

    var imageTest2 = '<img src = "weapon"/>';

    deepEqual(parser.parse(imageTest2),
              [
                  {text: "", style: {isImage: true, src: "weapon"}}
              ], "image element test 2");

    var imageTest3 = "hello, <b>world<img src='nihao' /></>";

    deepEqual(parser.parse(imageTest3),
              [
                  {text: "hello, "},
                  {text: "world", style : {bold: true}},
                  {text: "", style: {isImage: true, src: "nihao"}}
              ], "image element test");

    var imageTest4 = "hello, <b>world<img src=nihao /  ></>";
    deepEqual(parser.parse(imageTest4),
              [
                  {text: "hello, "},
                  {text: "world", style : {bold: true}},
              ], "image element test");

    var imageTest5 = "hello, <b>world<on click='handler'><img src=nihao /  ></on></b>";
    deepEqual(parser.parse(imageTest5),
              [
                  {text: "hello, "},
                  {text: "world", style : {bold: true}},
              ], "image element event test");

    var imageTest6 = "hello, <b>world<img src='head' click='handler' /></b>";
    deepEqual(parser.parse(imageTest6),
              [
                  {text: "hello, "},
                  {text: "world", style : {bold: true}},
                  {text: "", style: {isImage: true, src: "head",
                                     event: {click: "handler"}}}
              ], "image element event test");


    var invalidImageTest1 = "<img src='hello'></img>";
    deepEqual(parser.parse(invalidImageTest1),
              [], "image element invalid test");

    var invalidImageTest2 = "<img src='world'>";
    deepEqual(parser.parse(invalidImageTest2),
              [], "image element invalid test");

    var invalidImageTest3 = "<image src='world' />";
    deepEqual(parser.parse(invalidImageTest3),
              [], "image element invalid test");


    var nestedImageTest4 = "<b><u><img src='world' click='handler' /></b></u>";
    deepEqual(parser.parse(nestedImageTest4),
              [{text: "", style: {isImage: true, src: 'world',
                                  event: {click: 'handler'}}}], "image element invalid test");
});

test('test outline tag', function () {
    var outlineTest1 = "<outline color = #0f00ff width=2 >hello</outline>";

    deepEqual(parser.parse(outlineTest1),
              [
                  {text: "hello",
                   style: { outline: {
                       color: "#0f00ff",
                       width: 2
                   }}}
              ], "outline element test 1");

    var outlineTest2 = '<outline color= #0f00ff>hello</outline>';

    deepEqual(parser.parse(outlineTest2),
              [
                  {text: "hello", style: {
                      outline: {
                          color: "#0f00ff",
                          width: 1
                      }
                  }}
              ], "outline element test 2");

    var outlineTest3 = '<outline width =  4>hello</outline>';

    deepEqual(parser.parse(outlineTest3),
              [
                  {text: "hello", style: {
                      outline: {
                          color: "#ffffff",
                          width: 4
                      }
                  }}
              ], "outline element test 3");

    var outlineTest4 = '<outline >hello</outline>';

    deepEqual(parser.parse(outlineTest4),
              [
                  {text: "hello", style: {
                      outline: {
                          color: "#ffffff",
                          width: 1
                      }
                  }}
              ], "outline element test 4");

    var outlineTest5 = "<outline click=  'clickme' width =2 color=#0f00ff>hello</outline>";

    deepEqual(parser.parse(outlineTest5),
              [
                  {text: "hello",
                   style: {
                       outline: {
                           color: "#0f00ff",
                           width: 2
                       },
                       event: {
                           click: "clickme"
                       }
                   }}
              ], "outline element test 5");

    var outlineTest6 = "<outline  width =2 color=#0f00ff click='clickme'>hello</outline>";

    deepEqual(parser.parse(outlineTest6),
              [
                  {text: "hello",
                   style: {
                       outline: {
                           color: "#0f00ff",
                           width: 2
                       },
                       event: {
                           click: "clickme"
                       }
                   }}
              ], "outline element test 6");

    var outlineTest7 = "<outline  width =2 color=#0f00ff><on click='clickme'>hello</on></outline>";

    deepEqual(parser.parse(outlineTest7),
              [
                  {text: "hello",
                   style: {
                       outline: {
                           color: "#0f00ff",
                           width: 2
                       },
                       event: {
                           click: "clickme"
                       }
                   }}
              ], "outline element test 7");

    var outlineTest8 = "<b><outline  width =2 color=#0f00ff><on click='clickme'><u>hello</u></on></outline></b>";

    deepEqual(parser.parse(outlineTest8),
              [
                  {text: "hello",
                   style: {
                       bold: true,
                       underline: true,
                       outline: {
                           color: "#0f00ff",
                           width: 2
                       },
                       event: {
                           click: "clickme"
                       }
                   }}
              ], "outline element test 8");

    var invalidOutlineTest1 = "<outline  width=2 color #0f00ff click='clickme'>hello</outline>";

    deepEqual(parser.parse(invalidOutlineTest1),
              [
                  {text: "hello",
                   style: {
                       outline: {
                           color: "#ffffff",
                           width: 2
                       },
                       event: {
                           click: "clickme"
                       }
                   }}
              ], "invalid outline element test 1");

    var invalidOutlineTest2 = "<outline  width 2 color #0f00ff click 'clickme'>hello</outline>";

    deepEqual(parser.parse(invalidOutlineTest2),
              [
                  {text: "hello",
                   style: {
                       outline: {
                           color: "#ffffff",
                           width: 1
                       }
                   }}
              ], "invalid outline element test 2");

    var invalidOutlineTest3 = "<outilne  width 2 color #0f00ff click 'clickme'>hello</outline>";

    deepEqual(parser.parse(invalidOutlineTest3),
              [
                  {text: "hello",
                   style: {}}
              ], "invalid outline element test 3");


});
