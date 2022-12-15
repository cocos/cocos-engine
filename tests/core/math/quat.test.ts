import { Mat3, Quat } from "../../../cocos/core";

// test Quat
describe('Test Quat', () => {
    test('fromMat3', () => {
        const mat3 = new Mat3(1, 0, 0,
                              0, 0, -1,
                              0, 1, 0);
        let quat = new Quat;
        Quat.fromMat3(quat, mat3);
        expect(quat).toMatchObject({
            x: -0.7071067811865475,
            y: 0,
            z: 0,
            w: 0.7071067811865476
        });
    });
});