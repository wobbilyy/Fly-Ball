import { createBat, initializeWalls } from "./obstacles";
import bodyType, { bodyCopy, bodyIdentificationMap, bodyInit, bodySetCentroid, bodySetVelocity } from "./body";
import { createDrag, createNewtonianGravity, createPhysicsCollision } from "./force";
import sceneType, { sceneAddBody, sceneCopy, sceneInit, sceneTick } from "./scene";
import { vectorAdd, vectorSubtract, vectorType } from "./vector";
import { makeCircle } from "./polygon";

export const WINDOW_HEIGHT = 640;
export const WINDOW_LENGTH = 1280;
export const GROUND_HEIGHT = WINDOW_HEIGHT * 0.075;

export const PLAYER_MASS:number = 1;
export const PLAYER_RADIUS:number = 25;
export const PLAYER_START_POSITION:vectorType = { x: WINDOW_LENGTH / 10, y: WINDOW_HEIGHT / 2 };

export const BAT_OFFSET:number = WINDOW_HEIGHT * 0.1;
export const BAT_WIDTH:number = 25;
export const UPPER_BAT_SHAPE:vectorType[] = [ {x: WINDOW_LENGTH - BAT_WIDTH, y: WINDOW_HEIGHT / 2 + BAT_OFFSET}, {x: WINDOW_LENGTH - BAT_WIDTH, y: WINDOW_HEIGHT},                  {x: WINDOW_LENGTH + BAT_WIDTH, y: WINDOW_HEIGHT},                  {x: WINDOW_LENGTH + BAT_WIDTH, y: WINDOW_HEIGHT / 2 + BAT_OFFSET} ];
export const LOWER_BAT_SHAPE:vectorType[] = [ {x: WINDOW_LENGTH - 24, y: 0},                                     {x: WINDOW_LENGTH - BAT_WIDTH, y: WINDOW_HEIGHT / 2 - BAT_OFFSET}, {x: WINDOW_LENGTH + BAT_WIDTH, y: WINDOW_HEIGHT / 2 - BAT_OFFSET}, {x: WINDOW_LENGTH + BAT_WIDTH, y: 0} ];

export const JUMP_VELOCITY:vectorType = { x: 0, y: 200 };
export const VERTICAL_VELOCITY:vectorType = { x: 200, y: 500 };
export const VELOCITY_SCALE:number = 1.05;

export const M:number = 8E12; // 6E24;
export const G:number = 6.67E-11;
export const GAMMA:number = 1;
export const g:number = 9.8; // 9.8
export const R:number = 400000;

export const UNIT_SQUARE:vectorType[] = [ {x: 0, y: 0}, {x: 0, y: 50}, {x: 50, y: 50}, {x: 50, y: 0} ];
export const PLAYER_SHAPE:vectorType[] = makeCircle(PLAYER_RADIUS);
export const WALL_SHAPE:vectorType[] = [ {x: 0, y: 0}, {x: 0, y: WINDOW_HEIGHT}, {x: 1, y: WINDOW_HEIGHT}, {x: 1, y: 0} ];
export const GROUND_SHAPE:vectorType[] = [{ x: 0, y: 0 }, { x: 0, y: GROUND_HEIGHT }, { x: WINDOW_LENGTH, y: GROUND_HEIGHT }, { x: WINDOW_LENGTH, y: 0 }];

export function flyballInit(): sceneType {
    let scene:sceneType = sceneInit();

    // player
    let player:bodyType = bodyInit(UNIT_SQUARE, PLAYER_MASS, scene.nextBodyIndex, { bodyIdentification: bodyIdentificationMap.PLAYER, remove: false, checked: false, affectedScore: false });
    bodySetCentroid(player, PLAYER_START_POSITION);
    sceneAddBody(scene, player);

    // player forces
    createDrag(scene, GAMMA, player);

    // gravity
    let ANCHOR_POSITION = vectorSubtract(PLAYER_START_POSITION, { x: 0, y: R});
    let gravityAnchor:bodyType = bodyInit(UNIT_SQUARE, M, scene.nextBodyIndex, { bodyIdentification: bodyIdentificationMap.GROUND, remove: false, checked: false, affectedScore: false });
    bodySetCentroid(gravityAnchor, ANCHOR_POSITION);
    sceneAddBody(scene, gravityAnchor);
    createNewtonianGravity(scene, g, player, gravityAnchor);
  
    initializeWalls(scene);

    createBat(scene);

    // init_scrolling_ground(state);
    // add_scrolling_ground(state);
      
    return scene;
}

export function flyballMain(scene:sceneType, dt:number): sceneType {
    let copy:sceneType = sceneCopy(scene);

    // handle_power_up(state, dt);

    updateVelocities(copy);

    incrementScore(copy);
    
    sceneTick(copy, dt / 1000);

    return copy;
}

export function jump(bodies:bodyType[]): bodyType[] {
    let copy:bodyType[] = [];

    for (let i:number = 0; i < bodies.length; i++) {
        copy.push( bodyCopy(bodies[i]) );
    }

    bodySetVelocity( copy[0], JUMP_VELOCITY );

    return copy;
}

export function jumpW(bodies:bodyType[]): bodyType[] {
    let copy:bodyType[] = [];

    for (let i:number = 0; i < bodies.length; i++) {
        copy.push( bodyCopy(bodies[i]) );
    }

    bodySetCentroid( copy[0], vectorAdd(copy[0].position, { x: 0, y: 2 }) );

    return copy;
}


export function jumpS(bodies:bodyType[]): bodyType[] {
    let copy:bodyType[] = [];

    for (let i:number = 0; i < bodies.length; i++) {
        copy.push( bodyCopy(bodies[i]) );
    }

    bodySetCentroid( copy[0], vectorAdd(copy[0].position, { x: 0, y: -2 }) );

    return copy;
}

export function jumpA(bodies:bodyType[]): bodyType[] {
    let copy:bodyType[] = [];

    for (let i:number = 0; i < bodies.length; i++) {
        copy.push( bodyCopy(bodies[i]) );
    }

    bodySetCentroid( copy[0], vectorAdd(copy[0].position, { x: -10, y: 0 }) );

    return copy;
}

export function jumpD(bodies:bodyType[]): bodyType[] {
    let copy:bodyType[] = [];

    for (let i:number = 0; i < bodies.length; i++) {
        copy.push( bodyCopy(bodies[i]) );
    }

    bodySetCentroid( copy[0], vectorAdd(copy[0].position, { x: 10, y: 0 }) );

    return copy;
}


function incrementScore(scene:sceneType):void {

    let body:bodyType;

    for (let i:number = 0; i < scene.bodies.length; i++) {
        body = scene.bodies[i];
        if (body.bodyInfo.bodyIdentification === bodyIdentificationMap.L_BAT && body.bodyInfo.affectedScore === false) {
            if (body.position.x <= scene.bodies[0].position.x) {
                // increment score
                scene.score += scene.multiplier;
                body.bodyInfo.affectedScore = true;
            } else {
                break;
            }
        }
    }
}

function updateVelocities(scene:sceneType): void {

    let body:bodyType;

    for (let i:number = 0; i < scene.bodies.length; i++) {
        body = scene.bodies[i];
        if (body.bodyInfo.bodyIdentification === bodyIdentificationMap.U_BAT || body.bodyInfo.bodyIdentification === bodyIdentificationMap.L_BAT) {
            body.velocity = scene.scrollVelocity;
        }
    }
}
