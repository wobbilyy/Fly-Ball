import Ground from "../components/ground";
import bodyType, { bodyAddForce, bodyAddImpulse, bodyGetCentroid, bodyGetMass, bodyGetShape, bodyGetVelocity, bodyRemove, bodyInfoType, bodyIdentificationMap, bodyCopy, bodyGetIndex } from "./body";
import { collisionInfoType, findCollision } from "./collision";
import sceneType, { forceInfoType, sceneAddForceCreator, sceneAddPowerup, sceneFindBody } from "./scene";
import { vectorDistance, vectorMultiply, vectorNegate, vectorSubtract, vectorType, vectorDot } from "./vector";

type collisionAuxType = {
    handler:Function,
    handlerAux:unknown,
    collidedLastTick:boolean
}

export type auxType = {
    constant:number;
    bodies:number[];
    collisionAux:collisionAuxType;
}

const MINIMUM_DISTANCE:number = 100.0;

export function collisionAuxInit(handler:Function, handlerAux:unknown, collidedLastTick:boolean): collisionAuxType {
    let collisionAux:collisionAuxType = {
        handler: handler,
        handlerAux: handlerAux,
        collidedLastTick: collidedLastTick
    };

    return collisionAux;
}

export function auxInit(constant:number, bodies:number[]): auxType {
    let aux:auxType = {
        constant: constant,
        bodies: bodies,
        collisionAux: null,
    }

    return aux;
}

export function auxCopy(aux:auxType): auxType {
    let copy:auxType = {
        constant: aux.constant,
        bodies: [ ...aux.bodies ],
        collisionAux: { ...aux.collisionAux },
    }

    return copy;
}

function newtonianGravity(scene:sceneType, aux:auxType): void {
    let body1:bodyType = sceneFindBody(scene, aux.bodies[0]);
    let body2:bodyType = sceneFindBody(scene, aux.bodies[1]);

    let G:number = aux.constant; // gravity scale later

    let distance:number = vectorDistance(bodyGetCentroid(body1), bodyGetCentroid(body2));

    if (distance > MINIMUM_DISTANCE) {
        let forceConstant:number = (G * bodyGetMass(body1) * bodyGetMass(body2)) / (distance * distance);
        let direction:vectorType = vectorMultiply(1.0 / distance, vectorSubtract(bodyGetCentroid(body2), bodyGetCentroid(body1)));

        let force:vectorType = vectorMultiply(forceConstant, direction);

        bodyAddForce(body1, force);
        bodyAddForce(body2, vectorNegate(force));
    }
}

export function createNewtonianGravity(scene:sceneType, G:number, body1:bodyType, body2:bodyType): forceInfoType {
    let bodies:number[] = [];
    bodies.push(bodyGetIndex(body1));
    bodies.push(bodyGetIndex(body2));

    let aux:auxType = auxInit(G, bodies);

    return sceneAddForceCreator(scene, newtonianGravity, aux);
}

function springForce(scene:sceneType, aux:auxType): void {
    let body1:bodyType = sceneFindBody(scene, aux.bodies[0]);
    let body2:bodyType = sceneFindBody(scene, aux.bodies[1]);
    let k:number = aux.constant;

    let force:vectorType = vectorMultiply(k, vectorSubtract(bodyGetCentroid(body2), bodyGetCentroid(body1)));

    bodyAddForce(body1, force);
    bodyAddForce(body2, vectorNegate(force));
}

export function createSpring(scene:sceneType, k:number, body1:bodyType, body2:bodyType): forceInfoType {
    let bodies:number[] = [];
    bodies.push(bodyGetIndex(body1));
    bodies.push(bodyGetIndex(body2));

    let aux:auxType = auxInit(k, bodies);

    return sceneAddForceCreator(scene, springForce, aux);
}

function dragForce(scene:sceneType, aux:auxType): void {
    let body:bodyType = sceneFindBody(scene, aux.bodies[0]);

    let gamma:number = aux.constant;

    bodyAddForce(body, vectorMultiply(-gamma, bodyGetVelocity(body)));
}

export function createDrag(scene:sceneType, gamma:number, body:bodyType): forceInfoType {
    let bodies:number[] = [];
    bodies.push(bodyGetIndex(body));

    let aux:auxType = auxInit(gamma, bodies);

    return sceneAddForceCreator(scene, dragForce, aux);
}

function destructiveCollisionForceHandler(body1:bodyType, body2:bodyType, axis:vectorType, aux:unknown): void {
    if (body1.bodyInfo.bodyIdentification === bodyIdentificationMap.PLAYER) {
        bodyRemove(body1);
    } else if (body1.bodyInfo.bodyIdentification === bodyIdentificationMap.WALL) {
        bodyRemove(body2);
    } 
}

function physicsCollisionForceHandler(body1:bodyType, body2:bodyType, axis:vectorType, aux:unknown): void {
    let elasticity:number = Number(aux);

    let m_a = bodyGetMass(body1);
    let m_b = bodyGetMass(body2);
    let reducedMass:number = ( (m_a * m_b) / (m_a + m_b) );

    let u_a:number = vectorDot(bodyGetVelocity(body1), axis);
    let u_b:number = vectorDot(bodyGetVelocity(body2), axis);
    let components:number = u_a - u_b;
    
    if (m_a == Number.MAX_VALUE) {
        reducedMass = m_b;
        components = u_b;
    } else if (m_b == Number.MAX_VALUE) {
        reducedMass = m_a;
        components = u_a;
    }

    let impulse:vectorType = vectorMultiply((reducedMass * (1.0 + elasticity)) * components, axis);

    bodyAddImpulse(body1, vectorNegate(impulse));
    bodyAddImpulse(body2, (impulse));
    
    // add condition to kill the game if the player hits the ground
    if (body1.bodyInfo.bodyIdentification === bodyIdentificationMap.PLAYER && body2.bodyInfo.bodyIdentification === bodyIdentificationMap.GROUND) {
        body1.bodyInfo.checked = true;
    }
}

function powerupCollisionForceHandler(body1:bodyType, body2:bodyType, axis:vectorType, aux:unknown): void {
    let bodyInfo1:bodyInfoType = body1.bodyInfo;
    let bodyInfo2:bodyInfoType = body2.bodyInfo;
    let scene:sceneType = aux as sceneType;

    if (bodyInfo2.bodyIdentification >= bodyIdentificationMap.SLOW_MO) {
        bodyRemove(body2);
        sceneAddPowerup(scene, bodyInfo2.bodyIdentification, 2.0);
    }
}

function collisionForce(scene:sceneType, aux:auxType): void {
    let handler:Function = aux.collisionAux.handler;
    let body1:bodyType = sceneFindBody(scene, aux.bodies[0]);
    let body2:bodyType = sceneFindBody(scene, aux.bodies[1]);

    let auxForHandler:unknown = aux.collisionAux.handlerAux;

    let body1Shape:vectorType[] = bodyGetShape(body1);
    let body2Shape:vectorType[] = bodyGetShape(body2);

    let collisionInfo:collisionInfoType = findCollision(body1Shape, body2Shape);

    if (collisionInfo.collided && !aux.collisionAux.collidedLastTick) {
        handler(body1, body2, collisionInfo.axis, auxForHandler);
        aux.collisionAux.collidedLastTick = true;
    } else if (!collisionInfo.collided) {
        aux.collisionAux.collidedLastTick = false;
    }
}

export function createDestructiveCollision(scene:sceneType, body1:bodyType, body2:bodyType): forceInfoType {
    return createCollision(scene, body1, body2, destructiveCollisionForceHandler, null);
}

export function createPhysicsCollision(scene:sceneType, elasticity:number, body1:bodyType, body2:bodyType): forceInfoType {
    return createCollision(scene, body1, body2, physicsCollisionForceHandler, elasticity);
}

export function createPowerupCollision(scene:sceneType, body1:bodyType, body2:bodyType): forceInfoType {
    return createCollision(scene, body1, body2, powerupCollisionForceHandler, scene);
}

function createCollision(scene:sceneType, body1:bodyType, body2:bodyType, collisionHandler:Function, aux:unknown): forceInfoType {
    let bodies:number[] = [];
    bodies.push(bodyGetIndex(body1));
    bodies.push(bodyGetIndex(body2));

    let forceCreatorAux:auxType = auxInit(0, bodies);
    forceCreatorAux.collisionAux = collisionAuxInit(collisionHandler, aux, false);

    return sceneAddForceCreator(scene, collisionForce, forceCreatorAux);
}
