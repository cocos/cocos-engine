import { Component, director } from "../../exports/base";

class MyComponent extends Component {
}

test('scheduleOnce', function () {

    let result = "";
    let component = new MyComponent;

    for (let i = 0; i <= 9; ++i) {
        component.schedule(()=>{
            result += i;
        }, 0, 0, 0);
    }

    director.getScheduler().update(0.1);
    director.getScheduler().update(0.1);

    expect(result).toEqual("0123456789");
});