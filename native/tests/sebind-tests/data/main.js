
function assert(value, message) {
    if (!value) {
        utils.assert(value, message);
    }
}
const l = console.log;
try {
    l("create fruit");
    let f1 = new demo.Fruit("Banana");
    l(`fruit name ${f1.name}`);
    assert(f1.name === "Banana", "access fruit name attribute");
    
    l("call toString & fullInfo");
    assert(f1.toString() === f1.fullInfo(), "call full info")
    
    l("update uid");
    f1.uid = 888;
    assert(f1.uid === 888, "set and get uid");

    l("update sweetness");
    f1.sweetness = 8989;
    assert(f1.sweetness === 8989, "set and get sweetness");

    l("update name");
    f1.name = "None";
    assert(f1.name === "Banana", "name should not be modified");

    l("other fruit constructor")
    let f2 = new demo.Fruit("Apple", 100);
    assert(f2.name == "Apple", "check fruit name of Apple");
    assert(f2.price == 100, "check price 100");

    demo.Coconut.prototype.rock = function () {
        return "Coconut Rock";
    }
    let c = new demo.Coconut();
    l("call js");
    assert(c.callJsFunction("rock") == "Coconut Rock", "Call JS function");
    l("call setRadius");
    assert(typeof c.setRadius === 'function', "functio setRadius");
    l("call getRadius");
    assert(typeof c.getRadius === 'function', "functio getRadius");
    l("call static 123");
    assert(typeof demo.Coconut.OneTwoThree === 'function', "static function getRadius");
    l("call inherited function");
    assert(typeof c.fullInfo === 'function' , "toString found");
    utils.exit(0);

} catch (e) {
    console.log(e);
    debugger;
    utils.exit(1);
}

function gameTick(dt) {
    // console.log("run game tick");
}
