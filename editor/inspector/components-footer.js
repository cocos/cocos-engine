const { join } = require('path');

module.exports = {
    'cc.BoxCollider': join(__dirname, './components/collider/box-collider-footer.js'),
    'cc.CapsuleCollider': join(__dirname, './components/collider/capsule-collider-footer.js'),
    'cc.ConeCollider': join(__dirname, './components/collider/cone-collider-footer.js'),
    'cc.CylinderCollider': join(__dirname, './components/collider/cylinder-collider-footer.js'),
    'cc.LightProbeGroup': join(__dirname, './components/light-probe-group-footer.js'),
    'cc.SphereCollider': join(__dirname, './components/collider/sphere-collider-footer.js'),
};
