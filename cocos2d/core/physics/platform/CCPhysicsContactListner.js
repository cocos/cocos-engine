
cc.PhysicsContactListener = module.exports = {
    create: function () {
        var contactFixtures = [];

        var isWasm = b2.isWasm;
        var contactListener = isWasm ? new Box2D.JSContactListener() : {};

        var _BeginContact, _EndContact, _PreSolve, _PostSolve;

        contactListener.setBeginContact = function (cb) {
            _BeginContact = cb;
        };

        contactListener.setEndContact = function (cb) {
            _EndContact = cb;
        };

        contactListener.setPreSolve = function (cb) {
            _PreSolve = cb;
        };

        contactListener.setPostSolve = function (cb) {
            _PostSolve = cb;
        };

        contactListener.BeginContact = function (contact) {
            if (!_BeginContact) return;

            if (isWasm) {
                contact = Box2D.wrapPointer( contact, b2.Contact );
            }

            var fixtureA = contact.GetFixtureA();
            var fixtureB = contact.GetFixtureB();
            var fixtures = contactFixtures;
            
            contact._shouldReport = false;
            
            if (fixtures.indexOf(fixtureA) !== -1 || fixtures.indexOf(fixtureB) !== -1) {
                contact._shouldReport = true; // for quick check whether this contact should report
                _BeginContact(contact);
            }
        };

        contactListener.EndContact = function (contact) {
            if (!_EndContact) return;

            if (isWasm) {
                contact = Box2D.wrapPointer( contact, b2.Contact );
            }

            if (!contact._shouldReport) return;

            contact._shouldReport = false;
            _EndContact(contact);
        };

        contactListener.PreSolve = function (contact) {
            if (!_PreSolve) return;

            if (isWasm) {
                contact = Box2D.wrapPointer( contact, b2.Contact );
            }

            if (!contact._shouldReport) return;

            _PreSolve(contact);
        };

        contactListener.PostSolve = function (contact, impulse) {
            if (!_PostSolve) return;

            if (isWasm) {
                contact = Box2D.wrapPointer( contact, b2.Contact );
                impulse = Box2D.wrapPointer( impulse, b2.ContactImpulse );
            }

            if (!contact._shouldReport) return;

            _PostSolve(contact, impulse);
        };

        contactListener.registerContactFixture = function (fixture) {
            contactFixtures.push(fixture);
        };

        contactListener.unregisterContactFixture = function (fixture) {
            cc.js.array.remove(contactFixtures, fixture);
        };

        return contactListener;
    }
};
