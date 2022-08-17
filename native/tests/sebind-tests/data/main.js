
const l = utils.log;

function assert(value, message) {
    if (!value) {
        utils.assert(value, message);
    }
}

let blocks = [];
function block(name, fn) {
    blocks.push({ name, fn });
}

function flush() {
    for(let i = 0 ; i <  blocks.length; i++) {
        l(`:: Run test ${i+1}/${blocks.length}, ${blocks[i].name}`);
        blocks[i].fn();
    }
}


try {

    l("create Coconut static function");
    let e = new demo.Coconut(1,2,3,4);
    
    let f1 = new demo.Fruit("Banana");
    block("create fruit", () => {
        f1 = new demo.Fruit("Banana");
    });

    block(`fruit name ${f1.name}`, () => {
        assert(f1.name === "Banana", "access fruit name attribute");
    });

    block("call toString & fullInfo", () => {
        assert(f1.toString() === f1.fullInfo(), "call full info");
    });
    block("update uid", () => {
        f1.uid = 888;
        assert(f1.uid === 888, "set and get uid");
    });

    block("update sweetness", () => {
        f1.sweetness = 8989;
        assert(f1.sweetness === 8989, "set and get sweetness");
    });
    block("update name", () => {
        f1.name = "None";
        assert(f1.name === "Banana", "name should not be modified");
    });
    let f2;
    block("other fruit constructor", () => {
        f2 = new demo.Fruit("Apple", 100);
        assert(f2.name == "Apple", "check fruit name of Apple");
        assert(f2.price == 100, "check price 100");
    });

    demo.Coconut.prototype.rock = function () {
        return "Coconut Rock";
    }
    let c = new demo.Coconut();
    block("call js", () => {
        assert(c.callJsFunction("rock") == "Coconut Rock", "Call JS function");
    });
    block("call setRadius", () => {
        assert(typeof c.setRadius === 'function', "function setRadius");
    });
    block("call getRadius", () => {
        assert(typeof c.getRadius === 'function', "function getRadius");
    });
    block("call static 123", () => {
        assert(typeof demo.Coconut.OneTwoThree === 'function', "static function OneTwoThree");
        let ret = demo.Coconut.OneTwoThree();
        assert(ret.length === 3, "[1,2,3]"); 
    });
    block("call inherited function", () => {
        assert(typeof c.fullInfo === 'function', "function fullInfo/toString found");
    });
    block("test combine", ()=>{
        let d = new demo.Coconut();
        d.combine(c);
        d.combine1(c);
        d.combine2(c);
        d.combine3(c);
    })


    l("create CoconutExt");
    let d = new demo.CoconutExt;
    block("check time", () => {
        assert(typeof demo.CoconutExt.time === 'number', "attribute time");
        l(`time is ${demo.CoconutExt.time}`)
    });
    block("check getTime", () => {
        assert(typeof demo.CoconutExt.getTime === 'function', "static time");
        l(`gettime is ${demo.CoconutExt.getTime()}`);
    });
    block("check area", () => {
        assert(typeof d.area === 'number', "attribute area");
        l(`area is ${d.area}`);
    });
    block("check getArea", () => {
        assert(typeof d.getArea === 'function', "getArea function");
        l(`get Area is ${d.getArea()}`);
    });
    block(`check weight`, () => {
        assert(typeof d.weight === 'number', "attribute weight");
        l(`weight is ${d.weight}`);
    });
    block("check getWeight", () => {
        assert(typeof d.getWeight === 'function', "getWeight function");
    });

    flush();

    l("----------done---------------");
    utils.exit(0);

} catch (e) {
    console.log(e);
    debugger;
    utils.exit(1);
}

function gameTick(dt) {
    // console.log("run game tick");
}
