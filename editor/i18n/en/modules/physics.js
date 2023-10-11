/* eslint-disable quote-props */

module.exports = {
    classes: {
        'cc': {
            'PhysicsMaterial': {
                properties: {
                    'friction': {
                        displayName: 'Friction',
                        tooltip:
                            'Friction coefficient. Higher the value, harder to get the object move and faster the move speed decreases. ' +
                            'A friction of 0 feels like ice.',
                    },
                    'rollingFriction': {
                        displayName: 'Rolling Friction',
                        tooltip: 'Rolling friction coefficient. Note this property is only supported on Bullet backend.',
                    },
                    'spinningFriction': {
                        displayName: 'Spinning Friction',
                        tooltip: 'Spinning Friction coefficient. Note this property is only supported on Bullet backend.',
                    },
                    'restitution': {
                        displayName: 'Restitution',
                        tooltip:
                            'Restitution coefficient. ' +
                            'Higher the value, less the kinetic energy loose. ' +
                            'A restitution of 0 loose all the energy after collision, ' +
                            'so it prevents the object from bounciness(if no other forces were applying), ' +
                            'feels like sponges. ' +
                            'A restitution of 1 does not looses any energy after collision, ' +
                            'so it keeps the object bouncing forever(if no other forces were applying), ' +
                            'feels like rubber balls.',
                    },
                },
            },
        },
    },
};
