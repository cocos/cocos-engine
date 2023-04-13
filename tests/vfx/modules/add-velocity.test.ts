import { ParticleModuleStage } from "../../../cocos/vfx/particle-module";
import { AddVelocityModule } from "../../../cocos/vfx/modules"

describe('addVelocity', () => {
    test('should add velocity to position', () => {
        const stage = new ParticleModuleStage();
        const module = stage.addModule(AddVelocityModule);
    });
});