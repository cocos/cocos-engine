import { IPhysicsWorld } from '../spec/i-physics-world'
import { EDITOR } from 'internal:constants';
import { Graphics } from '../../ui';
import { Node, CCObject, find, director, Vec3, Color, IVec2Like, Vec2, Rect } from '../../core';
import { Canvas } from '../../../exports/ui';
import { BuiltinShape2D } from './shapes/shape-2d';
import { BuiltinBoxShape } from './shapes/box-shape-2d';
import { BuiltinCircleShape } from './shapes/circle-shape-2d';
import { BuiltinPolygonShape } from './shapes/polygon-shape-2d';
import { EPhysics2DDrawFlags, Contact2DType, ERaycast2DType, RaycastResult2D } from '../framework/physics-types';
import { PhysicsSystem2D, Collider2D } from '../framework';
import { BuiltinContact } from './builtin-contact';

let contactResults: BuiltinContact[] = [];
let testIntersectResults: Collider2D[] = [];

export class BuiltinPhysicsWorld implements IPhysicsWorld {
    private _contacts: BuiltinContact[] = [];
    private _shapes: BuiltinShape2D[] = [];
    private _debugGraphics: Graphics | null = null;
    private _debugDrawFlags = 0;

    get debugDrawFlags () {
        return this._debugDrawFlags;
    }
    set debugDrawFlags (v) {
        this._debugDrawFlags = v;
    }

    shouldCollide (c1: BuiltinShape2D, c2: BuiltinShape2D) {
        let collider1 = c1.collider, collider2 = c2.collider;
        let collisionMatrix = PhysicsSystem2D.instance.collisionMatrix;
        return (collider1 !== collider2) && (collider1.node !== collider2.node) && (collisionMatrix[collider1.group] & collisionMatrix[collider2.group]);
    }

    addShape (shape: BuiltinShape2D) {
        let shapes = this._shapes;
        let index = shapes.indexOf(shape);
        if (index === -1) {
            for (let i = 0, l = shapes.length; i < l; i++) {
                let other = shapes[i];
                if (this.shouldCollide(shape, other)) {
                    let contact = new BuiltinContact(shape, other);
                    this._contacts.push(contact);
                }
            }

            shapes.push(shape);
        }
    }

    removeShape (shape: BuiltinShape2D) {
        let shapes = this._shapes;
        let index = shapes.indexOf(shape);
        if (index >= 0) {
            shapes.splice(index, 1);

            let contacts = this._contacts;
            for (let i = contacts.length - 1; i >= 0; i--) {
                let contact = contacts[i];
                if (contact.shape1 === shape || contact.shape2 === shape) {
                    if (contact.touching) {
                        this._emitCollide(contact, Contact2DType.END_CONTACT);
                    }

                    contacts.splice(i, 1);
                }
            }
        }
    }

    updateShapeGroup (shape: BuiltinShape2D) {
        this.removeShape(shape);
        this.addShape(shape);
    }

    step (deltaTime: number, velocityIterations = 10, positionIterations = 10) {
        // update collider
        let shapes = this._shapes;
        for (let i = 0, l = shapes.length; i < l; i++) {
            shapes[i].update();
        }

        // do collide
        let contacts = this._contacts;
        contactResults.length = 0;

        for (let i = 0, l = contacts.length; i < l; i++) {
            let collisionType = contacts[i].updateState();
            if (collisionType === Contact2DType.None) {
                continue;
            }

            contactResults.push(contacts[i]);
        }

        // handle collide results, emit message
        for (let i = 0, l = contactResults.length; i < l; i++) {
            let result = contactResults[i];
            this._emitCollide(result);
        }
    }

    drawDebug () {
        if (!this._debugDrawFlags) {
            return;
        }

        this._checkDebugDrawValid();

        let debugDrawer = this._debugGraphics!;
        if (!debugDrawer) {
            return;
        }

        debugDrawer.clear();

        let shapes = this._shapes;

        for (let i = 0, l = shapes.length; i < l; i++) {
            let shape = shapes[i];

            debugDrawer.strokeColor = Color.WHITE;
            if (shape instanceof BuiltinBoxShape || shape instanceof BuiltinPolygonShape) {
                let ps = shape.worldPoints;
                if (ps.length > 0) {
                    debugDrawer.moveTo(ps[0].x, ps[0].y);
                    for (let j = 1; j < ps.length; j++) {
                        debugDrawer.lineTo(ps[j].x, ps[j].y);
                    }
                    debugDrawer.close();
                    debugDrawer.stroke();
                }
            }
            else if (shape instanceof BuiltinCircleShape) {
                debugDrawer.circle(shape.worldPosition.x, shape.worldPosition.y, shape.worldRadius);
                debugDrawer.stroke();
            }

            if (this._debugDrawFlags & EPhysics2DDrawFlags.Aabb) {
                let aabb = shape.worldAABB;

                debugDrawer.strokeColor = Color.BLUE;

                debugDrawer.moveTo(aabb.xMin, aabb.yMin);
                debugDrawer.lineTo(aabb.xMin, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMax);
                debugDrawer.lineTo(aabb.xMax, aabb.yMin);

                debugDrawer.close();
                debugDrawer.stroke();
            }
        }
    }

    private _emitCollide (contact: BuiltinContact, collisionType?: string) {
        collisionType = collisionType || contact.type;

        let c1 = contact.shape1!.collider;
        let c2 = contact.shape2!.collider;

        PhysicsSystem2D.instance.emit(collisionType, c1, c2);
        c1.emit(collisionType, c1, c2);
        c2.emit(collisionType, c2, c1);
    }

    private _checkDebugDrawValid () {
        if (EDITOR) return;
        if (!this._debugGraphics || !this._debugGraphics.isValid) {
            let canvas = find('Canvas');
            if (!canvas) {
                let scene = director.getScene() as any;
                if (!scene) {
                    return;
                }
                canvas = new Node('Canvas');
                canvas.addComponent(Canvas);
                canvas.parent = scene;
            }

            let node = new Node('PHYSICS_2D_DEBUG_DRAW');
            // node.zIndex = cc.macro.MAX_ZINDEX;
            node._objFlags |= CCObject.Flags.DontSave;
            node.parent = canvas;
            node.worldPosition = Vec3.ZERO;

            this._debugGraphics = node.addComponent(Graphics);
            this._debugGraphics.lineWidth = 2;

        }

        let parent = this._debugGraphics.node.parent!;
        this._debugGraphics.node.setSiblingIndex(parent.children.length - 1);
    }

    testPoint (p: Vec2): readonly Collider2D[] {
        let shapes = this._shapes;
        testIntersectResults.length = 0;
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            if (!shape.containsPoint(p)) {
                continue;
            }
            testIntersectResults.push(shape.collider);
        }
        return testIntersectResults;
    }

    testAABB (rect: Rect): readonly Collider2D[] {
        let shapes = this._shapes;
        testIntersectResults.length = 0;
        for (let i = 0; i < shapes.length; i++) {
            let shape = shapes[i];
            if (!shape.intersectsRect(rect)) {
                continue;
            }
            testIntersectResults.push(shape.collider);
        }
        return testIntersectResults;
    }


    // empty implements
    impl () {
        return null;
    }
    setGravity () { }
    setAllowSleep () { }
    syncPhysicsToScene () { }
    syncSceneToPhysics () { }
    raycast (p1: IVec2Like, p2: IVec2Like, type: ERaycast2DType): RaycastResult2D[] {
        return[];
    }
}
