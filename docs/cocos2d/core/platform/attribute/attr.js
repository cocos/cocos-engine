-----
var myClass = function () { this.value = 0.5 };
cc.Class.attr(myClass, 'value');         // return undefined
cc.Class.attr(myClass, 'value', {}).min = 0;  // assign new attribute table
            //associated with 'value', and set its min = 0
cc.Class.attr(myClass, 'value', {       // set values max and default
   max: 1,
   default: 0.5,
});
cc.Class.attr(myClass, 'value');  // return { default: 0.5, min: 0, max: 1 }
