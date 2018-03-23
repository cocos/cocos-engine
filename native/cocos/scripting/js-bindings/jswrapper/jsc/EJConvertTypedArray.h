#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

#ifdef __cplusplus
extern "C" {
#endif

/*!
@enum JSType
@abstract     A constant identifying the Typed Array type of a JSValue.
@constant     kEJJSTypedArrayTypeNone                 Not a Typed Array.
@constant     kEJJSTypedArrayTypeInt8Array            Int8Array
@constant     kEJJSTypedArrayTypeInt16Array           Int16Array
@constant     kEJJSTypedArrayTypeInt32Array           Int32Array
@constant     kEJJSTypedArrayTypeUint8Array           Int8Array
@constant     kEJJSTypedArrayTypeUint8ClampedArray    Int8ClampedArray
@constant     kEJJSTypedArrayTypeUint16Array          Uint16Array
@constant     kEJJSTypedArrayTypeUint32Array          Uint32Array
@constant     kEJJSTypedArrayTypeFloat32Array         Float32Array
@constant     kEJJSTypedArrayTypeFloat64Array         Float64Array
@constant     kEJJSTypedArrayTypeArrayBuffer          ArrayBuffer
*/
typedef enum {
	kEJJSTypedArrayTypeNone = 0,
	kEJJSTypedArrayTypeInt8Array = 1,
	kEJJSTypedArrayTypeInt16Array = 2,
	kEJJSTypedArrayTypeInt32Array = 3,
	kEJJSTypedArrayTypeUint8Array = 4,
	kEJJSTypedArrayTypeUint8ClampedArray = 5,
	kEJJSTypedArrayTypeUint16Array = 6,
	kEJJSTypedArrayTypeUint32Array = 7,
	kEJJSTypedArrayTypeFloat32Array = 8,
	kEJJSTypedArrayTypeFloat64Array = 9,
	kEJJSTypedArrayTypeArrayBuffer = 10
} EJJSTypedArrayType;

/*!
@function
@abstract           Setup the JSContext for use of the Typed Array functions.
@param ctx          The execution context to use
*/
void EJJSContextPrepareTypedArrayAPI(JSContextRef ctx);

/*!
@function
@abstract           Returns a JavaScript value's Typed Array type
@param ctx          The execution context to use.
@param value        The JSObject whose Typed Array type you want to obtain.
@result             A value of type EJJSTypedArrayType that identifies value's Typed Array type
*/
EJJSTypedArrayType EJJSObjectGetTypedArrayType(JSContextRef ctx, JSObjectRef object);

/*!
@function
@abstract           Creates an empty JavaScript Typed Array with the given number of elements
@param ctx          The execution context to use.
@param arrayType    A value of type EJJSTypedArrayType identifying the type of array you want to create
@param numElements  The number of elements for the array.
@result             A JSObjectRef that is a Typed Array or NULL if there was an error
*/
JSObjectRef EJJSObjectMakeTypedArray(JSContextRef ctx, EJJSTypedArrayType arrayType, size_t numElements);

/*!
@function
@abstract           Returns a copy of the Typed Array's data
@param ctx          The execution context to use.
@param value        The JSObject whose Typed Array data you want to obtain.
@result             A copy of the Typed Array's data or NULL if the JSObject is not a Typed Array
*/
NSMutableData *EJJSObjectGetTypedArrayData(JSContextRef ctx, JSObjectRef object);

/*!
@function
@abstract           Replaces a Typed Array's data
@param ctx          The execution context to use.
@param value        The JSObject whose Typed Array data you want to replace
*/
void EJJSObjectSetTypedArrayData(JSContextRef ctx, JSObjectRef object, NSData *data);

#ifdef __cplusplus
}
#endif

