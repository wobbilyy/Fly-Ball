import { vectorType, vectorDot, vectorMultiply, VEC_ZERO, vectorNegate } from "./vector"

export type collisionInfoType = {
    collided:boolean,
    axis:vectorType
}

type pairType = {
    min:number,
    max:number
} 

function getPerpendicular(vertex:vectorType): vectorType {
    let perpendicular:vectorType = { x: -vertex.y, y: vertex.x };

    let magnitude:number = Math.sqrt(vectorDot(perpendicular, perpendicular));
    perpendicular = vectorMultiply(1.0 / magnitude, perpendicular);

    return perpendicular;
}

function project(shape:vectorType[], axis:vectorType) {
    let projection:number = vectorDot(shape[0], axis);

    let pair:pairType = { min: projection, max: projection };

    for (let i:number = 1; i < shape.length; i++) {
        projection = vectorDot(shape[i], axis);

        if (projection < pair.min) {
            pair.min = projection;
        } else if (projection > pair.max) {
            pair.max = projection;
        }
    }

    return pair;
}

export function findCollision(shape1:vectorType[], shape2:vectorType[]): collisionInfoType{
    let projection1:pairType;
    let projection2:pairType;

    let minimumDistance:number = Number.MAX_VALUE;
    let collisionAxis:vectorType = VEC_ZERO;

    for (let i:number = 0; i < shape1.length; i++) {
        let j:number = (i + 1) % shape1.length; 

        let axis:vectorType = getPerpendicular({ x: shape1[j].x - shape1[i].x, 
                                                 y: shape1[j].y - shape1[i].y});
        // let axis:vectorType = { x: shape1[j].x - shape1[i].x, 
        //                         y: shape1[j].y - shape1[i].y};

        projection1 = project(shape1, axis);
        projection2 = project(shape2, axis);

        if (projection1.max < projection2.min || projection2.max < projection1.min) {
            return { collided: false, axis: VEC_ZERO };
        }
        if (projection1.max > projection2.min && Math.abs(projection1.max - projection2.min) < minimumDistance) {
            minimumDistance = projection1.max - projection2.min;
            collisionAxis = axis;
        }
        if (projection2.max > projection1.min && Math.abs(projection2.max - projection1.min) < minimumDistance) {
            minimumDistance = projection2.max - projection1.min;
            collisionAxis = axis;
        }
    }

    for (let i:number = 0; i < shape2.length; i++) {
        let j:number = (i + 1) % shape2.length; 

        let axis:vectorType = getPerpendicular({ x: shape2[j].x - shape2[i].x, 
                                                 y: shape2[j].y - shape2[i].y});
        // let axis:vectorType = { x: shape2[j].x - shape2[i].x,
        //                         y: shape2[j].y - shape2[i].y };

        projection1 = project(shape1, axis);
        projection2 = project(shape2, axis);

        if (projection1.max < projection2.min || projection2.max < projection1.min) {
            return { collided: false, axis: VEC_ZERO };
        }
        if (projection1.max > projection2.min && Math.abs(projection1.max - projection2.min) < minimumDistance) {
            minimumDistance = projection1.max - projection2.min;
            collisionAxis = axis;
        }
        if (projection2.max > projection1.min && Math.abs(projection2.max - projection1.min) < minimumDistance) {
            minimumDistance = projection2.max - projection1.min;
            collisionAxis = axis;
        }                              
    }

    return { collided: true, axis: collisionAxis };
}
