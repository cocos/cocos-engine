QUnit.largeModule = function (name, testEnvironment) {
    module();
    test('------------------------------------------------------- ' + name + 
         ' -------------------------------------------------------', 0,
         function () {});
    module(name, testEnvironment);
};
window.largeModule = QUnit.largeModule;
