import { ParticleModuleStage } from "../../../cocos/particle/particle-module";
import { AddVelocityModule } from "../../../cocos/particle/modules"

describe('addVelocity', () => {
    test('should add velocity to position', () => {
        const stage = new ParticleModuleStage();
        const module = stage.addModule(AddVelocityModule);
    });
});