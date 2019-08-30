import CANNON from 'cannon';

export const defaultCannonMaterial = new CANNON.Material('');

export const defaultCannonContactMaterial = new CANNON.ContactMaterial(
    defaultCannonMaterial, defaultCannonMaterial, {
        friction: 0.06,
        restitution: 0,
    });
