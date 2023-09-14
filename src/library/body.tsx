import { polygonRotate, polygonTranslate, polygonCentroid } from './polygon.tsx';
import { vectorType, VEC_ZERO, vectorAdd, vectorMultiply, vectorSubtract } from './vector.tsx';

export const bodyIdentificationMap = {
    PLAYER: 1,
    ENEMY: 2,
    GROUND: 3, 
    L_BAT: 4,
    U_BAT: 5,
    WALL: 6,
    SLOW_MO: 7,
    INVINCIBILITY: 8,
    SCORE_MULTIPLIER: 9,
    GRAVITY_MULTIPLIER: 10,
    SPEED_UP: 11
}

export type bodyInfoType = {
    bodyIdentification: number;
    remove: boolean;
    checked: boolean;
    affectedScore: boolean;
}

type bodyType = {
    position: vectorType;
    velocity: vectorType;
    impulse: vectorType;
    force: vectorType;
    orientation: number;
    mass: number;
    shape: vectorType[];
    bodyIndex: number;
    bodyInfo: bodyInfoType;
}

export function bodyInit(shape:vectorType[], mass:number, bodyIndex:number, bodyInfo:bodyInfoType): bodyType {

    let shapeCopy:vectorType[] = [];
    for (let i:number = 0; i < shape.length; i++) {
        shapeCopy.push( { x: shape[i].x, y: shape[i].y } );
    }

    let body:bodyType = {
        position: polygonCentroid(shape),
        velocity: VEC_ZERO,
        impulse: VEC_ZERO,
        force: VEC_ZERO,
        orientation: 0,
        mass: mass,
        shape: shapeCopy,
        bodyInfo: bodyInfo,
        bodyIndex: bodyIndex
    };

    return body;
}

export function bodyCopy(body:bodyType): bodyType {

    let shape:vectorType[] = [];
    for (let i:number = 0; i < body.shape.length; i++) {
        shape.push( { x: body.shape[i].x, y: body.shape[i].y } );
    }

    let copy:bodyType = {
        position: { x: body.position.x, y: body.position.y },
        velocity: { x: body.velocity.x, y: body.velocity.y },
        impulse: { x: body.impulse.x, y: body.impulse.y },
        force: { x: body.force.x, y: body.force.y },
        orientation: body.orientation,
        mass: body.mass,
        shape: shape,
        bodyIndex: body.bodyIndex,
        bodyInfo: { bodyIdentification: body.bodyInfo.bodyIdentification, remove: body.bodyInfo.remove, checked: body.bodyInfo.checked, affectedScore: body.bodyInfo.affectedScore }
    };

    return copy;
}

export function bodyGetShape(body:bodyType): vectorType[] {
    let copy: vectorType[] = [];

    for (let i:number = 0; i < body.shape.length; i++) {
        let point:vectorType = body.shape[i];
        let newPoint:vectorType = { x: point.x, y: point.y };
        copy.push(newPoint);
    }

    return copy;
}

export function bodyGetCentroid(body:bodyType): vectorType {
    return body.position;
}

export function bodyGetVelocity(body:bodyType): vectorType {
    return body.velocity;
}

export function bodyGetMass(body:bodyType): number {
    return body.mass;
}

export function bodyGetIndex(body:bodyType): number {
    return body.bodyIndex;
}

export function bodySetCentroid(body:bodyType, centroid:vectorType): void {
    let translate:vectorType = vectorSubtract(centroid, body.position);
    body.position = centroid;
    polygonTranslate(body.shape, translate);
}

export function bodySetVelocity(body:bodyType, velocity:vectorType): void {
    body.velocity = velocity;
}

export function bodyAddImpulse(body:bodyType, impulse:vectorType): void {
    body.impulse = vectorAdd(body.impulse, impulse);
}

export function bodyAddForce(body:bodyType, force:vectorType): void {
    body.force = vectorAdd(body.force, force);
}

export function bodyResetImpulse(body:bodyType): void {
    body.impulse = VEC_ZERO
}

export function bodyResetForce(body:bodyType): void {
    body.force = VEC_ZERO
}

export function bodyRotate(body:bodyType, angle:number): void {
    polygonRotate(body.shape, angle, body.position);
}

export function bodyRotateAboutPoint(body:bodyType, point:vectorType, angle:number): void {
    polygonRotate(body.shape, angle, point); 
}

export function bodyRemove(body:bodyType): void {
    body.bodyInfo.remove = true;
}

export function isBodyRemoved(body:bodyType): boolean {
    return body.bodyInfo.remove;
}

export function bodyTick(body:bodyType, dt:number): void {
    var oldVelocity:vectorType = body.velocity;
    var averageVelocity:vectorType;

    bodySetVelocity(body, vectorAdd(
        vectorAdd(body.velocity, vectorMultiply(dt / body.mass, body.force)),
        vectorMultiply(1 / body.mass, body.impulse)));
    
    averageVelocity = vectorMultiply(0.5, vectorAdd(body.velocity, oldVelocity));
  
    var translate:vectorType = vectorMultiply(dt, averageVelocity);
    var newPosition:vectorType = vectorAdd(body.position, translate);
  
    bodySetCentroid(body, newPosition);
  
    bodyResetForce(body);
    bodyResetImpulse(body);
}

export default bodyType;
