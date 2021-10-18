import { Button } from "../../cocos/ui/button";
import { Node } from "../../cocos/core/scene-graph/node";
import { Vec3 } from "../../cocos/core/math/vec3";

test('Button scale with interactable', function () {

    let node0 = new Node();
    node0.addComponent(Button);
    let button0 = node0.getComponent(Button) as Button;

    
    let node1 = new Node();
    node1.addComponent(Button);
    let button1 = node1.getComponent(Button) as Button;

    let newScale = new Vec3(0.5,0.5,0.5);

    node0.scale = newScale;
    button0.interactable = false;

    button1.interactable = false;
    node1.scale = newScale;

    let same = Vec3.equals(node0.scale,node1.scale);
    expect(same).toBe(true);

    same = Vec3.equals(node0.scale,newScale);
    expect(same).toBe(true);

    same = Vec3.equals(node1.scale,newScale);
    expect(same).toBe(true);
});