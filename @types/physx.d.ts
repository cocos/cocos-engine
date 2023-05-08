/// <reference path="./phy.d.ts" />

declare module 'external:emscripten/physx/physx.release.asm.js' {
  export default PhysX;
}

declare module 'external:emscripten/physx/physx.release.wasm.js' {
  export default PhysX;
}

// tslint:disable
declare function PhysX (moduleOptions?: any): Promise<void>;

declare namespace PhysX {
  type Constructor<T = {}> = new (...args: any[]) => T;
  type VoidPtr = number;
  const NULL: {};
  const HEAPF32: Float32Array;
  function destroy (obj: PhysX.Type): void;
  function castObject<T1, T2 extends PhysX.Type> (obj: T1, fun: Constructor<T2>): T2;
  function wrapPointer<T extends PhysX.Type> (params: number, obj: Constructor<T>): T;
  function addFunction (params: Function): number;
  function getClass (obj: PhysX.Type): void;
  function getPointer (obj: PhysX.Type): void;
  function getCache (fun: Constructor<PhysX.Type>): void;
  function _malloc (byte: number): number;
  function _free (...args: any): any;
  function compare (obj1: PhysX.Type, obj2: PhysX.Type): boolean;

  class GeometryType {
    Enum: {
      eSPHERE: number,
      ePLANE: number,
      eCAPSULE: number,
      eBOX: number,
      eCONVEXMESH: number,
      eTRIANGLEMESH: number,
      eHEIGHTFIELD: number,
      eGEOMETRY_COUNT: number,	//!< internal use only!
      eINVALID: number //= -1		//!< internal use only!
    }
  }

  const PX_PHYSICS_VERSION: number
  interface AllocatorCallback { }
  class DefaultErrorCallback implements AllocatorCallback { }
  interface ErrorCallback { }
  class DefaultAllocator implements ErrorCallback { }

  class Foundation { }
  function createFoundation (a: number, b: AllocatorCallback, c: ErrorCallback): Foundation

  class Transform {
    constructor (p: number[], q: number[]);
    setPosition (t: number[]): void;
    getPosition (): number[];
    setQuaternion (t: number[]): void;
    getQuaternion (): number[];
  }

  class Base { }

  class Geometry { getType (): number }
  class BoxGeometry extends Geometry { constructor (x: number, y: number, z: number); }
  class SphereGeometry extends Geometry { constructor (r: number); }

  class Material extends Base { }

  class Shape extends Base { }

  class Actor extends Base {
    getGlobalPose (): Transform;
  }
  class RigidActor extends Actor {
    attachShape (shape: Shape): void;
    detachShape (shape: Shape, wakeOnLostTouch?: boolean | true): void;
  }
  class RigidBody extends RigidActor { }
  class RigidStatic extends RigidBody { }
  class RigidDynamic extends RigidBody { }

  class SceneDesc { }
  class Scene {
    simulate (timeStep: number): void;
    fetchResults (b: boolean): void;
    getActiveActors (len: number): Actor[];
  }

  class Physics {
    createSceneDesc (): SceneDesc;
    createScene (a: SceneDesc): Scene;
    createRigidDynamic (a: Transform): RigidDynamic;
    createRigidStatic (a: Transform): RigidStatic;
    createMaterial (staticFriction: number, dynamicFriction: number, restitution: number): Material;
    //shapeFlags = PxShapeFlag:: eVISUALIZATION | PxShapeFlag:: eSCENE_QUERY_SHAPE | PxShapeFlag:: eSIMULATION_SHAPE
    createShape (geometry: Geometry, material: Material, isExclusive: boolean | false, shapeFlags: number): Shape;
  }
  class TolerancesScale { length: number | 1.0; speed: number | 10.0 }
  class Pvd { }
  function createPhysics (a?: number, b?: Foundation, c?: TolerancesScale, trackOutstandingAllocations?: boolean, e?: Pvd): Physics;

  type Type = {}
}
