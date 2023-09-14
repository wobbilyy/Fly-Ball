import { checkBatDistance, createBat } from './obstacles.tsx';
import bodyType, { bodyCopy, bodyRemove, bodyTick, isBodyRemoved } from './body.tsx'
import { auxCopy, auxType } from './force.tsx';
import { VEC_ZERO, vectorType } from './vector.tsx';

export type sceneType = {
    bodies: bodyType[];
    forces: forceInfoType[];
    powerups: powerupInfoType[];
    scrollVelocity: vectorType;
    nextBodyIndex: number;
    score: number;
    multiplier: number;
}

export type forceInfoType = {
    aux: auxType;
    forceFunction: Function;
}

export type powerupInfoType = {
    type: number;
    timeLeft: number;
    initialized: boolean;
}

export function sceneInit(): sceneType {
    let scene:sceneType = {
        bodies: [],
        forces: [],
        powerups: [],
        scrollVelocity: { x: -250, y: 0 },
        nextBodyIndex: 0,
        score: 0,
        multiplier: 1
    };

    return scene;
}

export function sceneCopy(scene:sceneType):sceneType {
    let copy:sceneType = { 
        bodies: [],
        forces: [],
        powerups: [],
        scrollVelocity: { x: scene.scrollVelocity.x, y: scene.scrollVelocity.y },
        nextBodyIndex: scene.nextBodyIndex,
        score: scene.score,
        multiplier: scene.multiplier
    };

    for (let i:number = 0; i < scene.bodies.length; i++) {
        copy.bodies.push( bodyCopy(scene.bodies[i]) );
    }

    for (let i:number = 0; i < scene.forces.length; i++) {
        copy.forces.push( forceInfoCopy(scene.forces[i]) );
    }

    for (let i:number = 0; i < scene.powerups.length; i++) {
        copy.powerups.push( { ...scene.powerups[i] } );
    }

    return copy; 
}

function forceInfoCopy(forceInfo:forceInfoType): forceInfoType {
    let copy:forceInfoType = {
        aux: auxCopy(forceInfo.aux),
        forceFunction: forceInfo.forceFunction
    }

    return copy;
}

export function sceneAddBody(scene:sceneType, body:bodyType): void {
    scene.bodies.push(body);
    scene.nextBodyIndex++;
}

export function sceneAddForceCreator(scene:sceneType, forcer:Function, aux:auxType): forceInfoType {
    let forceInfo:forceInfoType = { aux: aux, forceFunction: forcer };
    scene.forces.push(forceInfo);

    return forceInfo;
}

export function sceneAddPowerup(scene:sceneType, powerup:number, time:number): powerupInfoType {
    let powerupInfo:powerupInfoType = { type: powerup, timeLeft: time, initialized: false };
    // scene.powerups.push(powerupInfo)

    return powerupInfo;
}

export function sceneFindBody(scene:sceneType, bodyIndex:number): bodyType {

    for (let i:number = 0; i < scene.bodies.length; i++) {
        if (scene.bodies[i].bodyIndex === bodyIndex) {
            return scene.bodies[i];
        }
    }

    return null; 
}

export function sceneUpdatePowerups(scene:sceneType, dt:number): { scene:sceneType, done:number[] } {
    let done:number[] = [];

    for (let i:number = 0; i < scene.powerups.length; i++) {
        let powerup:powerupInfoType = scene.powerups[i]; 
        powerup.timeLeft -= dt;
        if (powerup.timeLeft <= 0) {
            done.push(powerup.type);
            done.splice(i, 1);
            i--;
        }
    }

    return { scene:scene, done:done };
}

export function sceneTick(scene:sceneType, dt:number): void {    

    if (checkBatDistance(scene)) {
        createBat(scene);
        // scene.scrollVelocity = VEC_ZERO;
    }

    for (let i:number = 0; i < scene.forces.length; i++) {
        let forcer:Function = scene.forces[i].forceFunction;
        forcer(scene, scene.forces[i].aux);
    }

    let toRemove:boolean;

    for (let i:number = scene.forces.length - 1; i >= 0; i--) {
        
        let involvedBodies:number[] = scene.forces[i].aux.bodies;
        toRemove = false;

        for (let j:number = 0; j < involvedBodies.length; j++) {
            toRemove = toRemove || isBodyRemoved(sceneFindBody(scene, involvedBodies[j]));
        }

        if (toRemove) {
            scene.forces.splice(i, 1);
        }
    }

    for (let i:number = scene.bodies.length - 1; i >= 0; i--) {
        if (isBodyRemoved(scene.bodies[i])) {
            scene.bodies.splice(i, 1);
        }
    }

    for (let i:number = 0; i < scene.bodies.length; i++) {
        bodyTick(scene.bodies[i], dt);
    }
}

export default sceneType;
