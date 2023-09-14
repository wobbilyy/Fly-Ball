import bodyType, { bodyIdentificationMap, bodyInit, bodySetCentroid, bodySetVelocity } from "./body";
import { M, UPPER_BAT_SHAPE, LOWER_BAT_SHAPE, WALL_SHAPE, WINDOW_HEIGHT, WINDOW_LENGTH, GROUND_SHAPE, PLAYER_START_POSITION } from "./flyball";
import { createDestructiveCollision, createPhysicsCollision } from "./force";
import sceneType, { sceneAddBody } from "./scene";
import { vectorAdd, vectorSubtract, vectorType } from "./vector";

export function initializeWalls(scene:sceneType): void {

    let leftWall:bodyType = bodyInit(WALL_SHAPE, M, scene.nextBodyIndex, { bodyIdentification: bodyIdentificationMap.WALL, remove: false, checked: false, affectedScore: false });
    sceneAddBody(scene, leftWall);
    createDestructiveCollision(scene, scene.bodies[0], leftWall);

    let ground:bodyType = bodyInit(GROUND_SHAPE, M, scene.nextBodyIndex, { bodyIdentification: bodyIdentificationMap.GROUND, remove: false, checked: false, affectedScore: false });
    sceneAddBody(scene, ground);
    createPhysicsCollision(scene, 0.75, scene.bodies[0], ground);
}

export function checkBatDistance(scene:sceneType): boolean {
    let lastBat = scene.bodies[scene.bodies.length - 1];

    if (lastBat.bodyInfo.bodyIdentification !== bodyIdentificationMap.L_BAT && lastBat.bodyInfo.bodyIdentification !== bodyIdentificationMap.U_BAT) {
        return true; 
    }

    if (lastBat.bodyInfo.checked === true) {
        return false;
    }

    if (lastBat.position.x <= WINDOW_LENGTH * 2/3) { 
    // if (lastBat.position.x <= PLAYER_START_POSITION.x) {
        lastBat.bodyInfo.checked = true;
        console.log(JSON.stringify(lastBat.position));
        return true;
    } else {
        return false;
    }
}

export function createBat(scene:sceneType): void {
    let u_bat:bodyType = bodyInit(UPPER_BAT_SHAPE, M, scene.nextBodyIndex, { bodyIdentification: bodyIdentificationMap.U_BAT, remove: false, checked: false, affectedScore: false });
    let l_bat:bodyType = bodyInit(LOWER_BAT_SHAPE, M, scene.nextBodyIndex + 1, { bodyIdentification: bodyIdentificationMap.L_BAT, remove: false, checked: false, affectedScore: false });

    bodySetVelocity(u_bat, scene.scrollVelocity);
    bodySetVelocity(l_bat, scene.scrollVelocity);
    
    sceneAddBody(scene, u_bat);
    sceneAddBody(scene, l_bat);

    createDestructiveCollision(scene, scene.bodies[2], u_bat);
    createDestructiveCollision(scene, scene.bodies[2], l_bat);

    // createDestructiveCollision(scene, scene.bodies[0], u_bat);
    // createDestructiveCollision(scene, scene.bodies[0], l_bat);
    createPhysicsCollision(scene, 3.0, scene.bodies[0], u_bat);
    createPhysicsCollision(scene, 3.0, scene.bodies[0], l_bat);
}
