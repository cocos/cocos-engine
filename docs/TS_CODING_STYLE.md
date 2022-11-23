# TypeScript and JavaScript Coding Style Reference

The following are some coding style rules for TypeScript and JavaScript we concluded during the development of Cocos Creator. It's important to mention that it's based on some basic conventions and our practices. Due to the fact that TypeScript compiler and JavaScript engine is keep evolving rapidly, we try to make the references quite simple.

There are also some project related background need to be clarified:

1. TypeScript is used for script level code in the engine.
2. [Babel](https://babeljs.io/) and [Rollup](https://rollupjs.org/) are used to compile TypeScript to JavaScript.
3. [ESLint](https://eslint.org/) is strongly recommended for all engine developers.
4. [VSCode](https://code.visualstudio.com/) is suggested for TypeScript coding.
5. In web runtime environments, the engine is fully running compiled TypeScript codes with some WebAssembly modules like physics engine.
6. In native runtime environments, the TypeScript codes are running based on the C++ codes and the JavaScript binding.

## Naming Rules

- Use camelCase naming convention for object and instance variables, properties, functions and namespaces.

    ```typescript
    // bad
    let FOOBar = {};
    let foo_bar = {};
    function FOOBar () {}

    // good
    let fooBar = {};
    function fooBar () {}
    ```

- When using acronym for variables, properties or functions, keep all characters of the acronym case aligned. If the name starts with acronym then use lower case for all characters, otherwise capitalize all characters.

    ```typescript
    // bad
    let Id = 0;
    let iD = 0;
    function requireId () {}
    
    // good
    let id = 0;
    let uuid = '';
    function requireID () {}
    class AssetUUID {}
    ```

- Use PascalCase naming convention for classes or modules

    ```javascript
    // bad
    let foobar = cc.Class({
        foo: 'foo',
        bar: 'bar',
    });
    let foobar = require('foo-bar');

    // good
    let FooBar = cc.Class({
        foo: 'foo',
        bar: 'bar',
    });
    let FooBar = require('foo-bar');
    ```

- Accessor API conventions
  - Declare `public` property when the property is a direct value.

    ```typescript
    // bad
    class A {
        get a ():number {
            return this._a;
        }
        set a (val:number) {
            this._a = val;
        }
        private _a: number;
    }
    // good
    class A {
        public a: number;
    }
    ```

  - Suggest to make the property private and provide `getXXX/setXXX` methods when data accessing requires heavy logic.
  - Suggest to make the property private and provide `getXXX/setXXX` methods when data accessing implicitly affect other data.

    ```typescript
    // not recommended
    class A {
        get property ():number {
            // computeResult have some heavy logic
            return this.computeResult();
        }
    }
    // recommended
    class A {
        getProperty ():number {
            // computeResult have some heavy logic
            return this.computeResult();
        }
    }
    
    // ---
    
    // not recommended
    class A {
        get property ():number {
            return this._prop;
        }
        set property (val: number) {
            this._prop = val;
            this._a = this.computeA();
        }
        
        private _prop: number;
        private _a: number;
    }
    // recommended
    class A {
        getProperty ():number {
            return this._prop;
        }
        setProperty (val: number) {
            this._prop = val;
            this._a = this.computeA();
        }
        
        private _prop: number;
        private _a: number;
    }
    ```

  - Suggest to make the property private and provide public accessors if data accessing is light weight.
  - In other conditions, please follow the existing API design in the file context.

- Use all capitalized characters with underscores as word separator for CONSTANTS.

    ```typescript
    // bad
    const PRIVATE_letIABLE = 'should not be unnecessarily uppercased within a file';

    // bad
    let THING_TO_BE_CHANGED = 'should obviously not be uppercased';

    // bad
    let REASSIGNABLE_letIABLE = 'do not use let with uppercase letiables';

    // ---

    // allowed but does not supply semantic value
    export const apiKey = 'SOMEKEY';

    // better in most cases
    export const API_KEY = 'SOMEKEY';

    // ---

    // bad - unnecessarily uppercases key while adding no semantic value
    export const MAPPING = {
        KEY: 'value'
    };

    // good
    export const Type = {
        SIMPLE: 'value'
    };
    ```

- Use underscore `_` as prefix for private properties.

    ```typescript
    // bad
    class A {
        private __firstName__: string;
        private firstName_: string;
    }

    // good
    class A {
        private _firstName: string;
    }
    ```

- Use lowercase characters with dash `-` as word separator for TypeScript file names.

    ```bash
    // bad
    fooBar.ts
    FooBar.ts

    // good
    foo-bar.ts
    ```

## Syntax references

- If a class property doesn't contain any initialization value, should consider using declare to avoid potential [issue](https://github.com/microsoft/TypeScript/issues/37640)

    ```typescript
    // bad
    class A {
        public a:number;
        constructor (a:number) {
            // After compilation, the following line would be added to the constructor.
            // this.a = void 0; 
            // As the type of `a` is changing, this could cause performance issue
            this.a = a;
        }
    }
    
    // good
    class A {
        public a:number = 0; // Ok.
        constructor (a:number) {
            // After compilation, the following line would be added to the constructor.
            // this.a = 0; 
            // The type of `a` is constant
            this.a = a;
        }
    }

    // best
    class A {
        public declare a:number;
        public b:undefined | object; // OK: b won't be reassigned in constructor
        public declare c:object|null;

        constructor (a:number, c:object) {
            this.a = a;
            this.c = c;
        }
    }
    ```

- Suggest to use `Object.create(null)` to create dictionaries, whose contents will be added or deleted frequently.

    ```javascript
    // bad
    let map = new Object();

    // bad
    let map = {};

    // good
    let map = Object.create(null);
    ```

- Use strict comparison `===` and `!==` instead of `==` and `!=`

## Other coding conventions

- Use 4 spaces indent.

    ```typescript
    // bad
    function () {
    ∙let name;
    }

    // bad
    function () {
    ∙∙let name;
    }

    // very bad
    function () {
    ∙∙<tab>let name;
    }

    // good
    function () {
    ∙∙∙∙let name;
    }
    ```

- Don't leave tailed spaces, and leave an empty line at the end of the file.

    ```typescript
    // bad
    function () {∙
    ∙∙∙∙let name;∙
    }
    /* EOF */

    // good
    function () {
    ∙∙∙∙let name;
    }

    /* EOF */
    ```

- Always add `;` at the end of a code line.

    ```typescript
    // bad
    proto.foo = function () {
    }

    // good
    proto.foo = function () {
    };

    // bad
    function foo () {
        return 'test'
    }

    // very bad
    //   returns `undefined` instead of the value on the next line,
    //   always happens when `return` is on a line by itself because of Automatic Semicolon Insertion!
    function foo () {
        return
            'test'
    }

    // good
    function foo () {
        return 'test';
    }

    // bad
    function foo () {
    };

    // good: this is not a code line
    function foo () {
    }
    ```

- Suggest to keep `{` with the previous line.

    ```typescript
    // bad
    if ( isFoobar )
    {
    }

    // good
    if ( isFoobar ) {
    }

    // bad
    function foobar ()
    {
    }

    // good
    function foobar () {
    }

    // bad
    let obj =
    {
        foo: 'foo',
        bar: 'bar',
    }

    // good
    let obj = {
        foo: 'foo',
        bar: 'bar',
    }
    ```

- Leave one space before `{`

    ```typescript
    // bad
    if (isJedi){
        fight();
    }
    else{
        escape();
    }

    // good
    if (isJedi) {
        fight();
    }
    else {
        escape();
    }

    // bad
    dog.set('attr',{
        age: '1 year',
        breed: 'Bernese Mountain Dog',
    });

    // good
    dog.set('attr', {
        age: '1 year',
        breed: 'Bernese Mountain Dog',
    });
    ```

- Leave one space after `if`, `else`, `while` and `switch`

    ```typescript
    // bad
    if(isJedi) {
        fight ();
    }
    else{
        escape();
    }

    // good
    if (isJedi) {
        fight();
    }
    else {
        escape();
    }
    ```

- Leave one space before and after binary and ternary operators.

    ```typescript
    // bad
    let x=y+5;
    let left = rotated? y: x;

    // good
    let x = y + 5;
    let left = rotated ? y : x;

    // bad
    for (let i=0; i< 10; i++) {
    }

    // good
    for (let i = 0; i < 10; i++) {
    }
    ```

- Some function declaration references

    ```typescript
    // bad
    let test = function () {
        console.log('test');
    };

    // good
    function test () {
        console.log('test');
    }

    // bad
    function test () { console.log('test'); };

    // good
    function test () {
        console.log('test');
    }

    // bad
    function divisibleFunction () {
        return DEBUG ? 'foo' : 'bar';
    }

    // best
    let divisibleFunction = DEBUG ?
        function () {
            return 'foo';
        } :
        function () {
            return 'bar';
        };

    // bad
    function test(){
    }

    // good
    function test () {
    }

    // bad
    let obj = {
        foo: function () {
        }
    };

    // good
    let obj = {
        foo () {
        }
    };

    // bad
    array.map(x=>x + 1);
    array.map(x => {
        return x + 1;
    });

    // good
    array.map(x => x + 1);
    ```

- Suggest to leave empty line between code blocks.

    ```typescript
    // bad
    if (foo) {
        return bar;
    }
    return baz;

    // good
    if (foo) {
        return bar;
    }

    return baz;

    // bad
    const obj = {
        x: 0,
        y: 0,
        foo () {
        },
        bar () {
        },
    };
    return obj;

    // good
    const obj = {
        x: 0,
        y: 0,

        foo () {
        },

        bar () {
        },
    };

    return obj;
    ```

- Semicolon alignment.

    ```typescript
    // bad
    let story = [
          once
        , upon
        , aTime
    ];

    // good
    let story = [
        once,
        upon,
        aTime,
    ];

    // bad
    let hero = {
          firstName: 'Ada'
        , lastName: 'Lovelace'
        , birthYear: 1815
        , superPower: 'computers'
    };

    // good
    let hero = {
        firstName: 'Ada',
        lastName: 'Lovelace',
        birthYear: 1815,
        superPower: 'computers',
    };
    ```

- Single line comments

    ```typescript
    //bad
    // good
    ```

- Multiple line comments

    ```typescript
    /*
     * good
     */
    ```

- API documentation comments

    ```typescript
    /**
     * good
     */
    ```

- Except for API documentation, all comments must be written in English

    ```js
    // bad
    // 中文注释不利于非中文开发者阅读代码
    // good
    // Please write all in file comments in English
    ```

## Other references

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript#table-of-contents)
