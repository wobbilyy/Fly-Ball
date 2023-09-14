export type vectorType = {
    x: number;
    y: number;
}

export const VEC_ZERO:vectorType = {
    x: 0.0,
    y: 0.0
}

export function vectorAdd(v1:vectorType, v2:vectorType): vectorType {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

export function vectorSubtract(v1:vectorType, v2:vectorType): vectorType {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function vectorNegate(v:vectorType): vectorType {
    return { x: -v.x, y: -v.y };
}

export function vectorMultiply(scalar:number, v:vectorType): vectorType {
    return { x: scalar * v.x, y: scalar * v.y };
}

export function vectorDot(v1:vectorType, v2:vectorType): number {
    return v1.x * v2.x + v1.y * v2.y;
}

export function vectorCross(v1:vectorType, v2:vectorType): number {
    return v1.x * v2.y - v1.y * v2.x;
}

export function vectorRotate(v:vectorType, angle:number): vectorType {
    return {
        x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
        y: v.x * Math.sin(angle) + v.y * Math.cos(angle)
    };
}

export function vectorDistance(v1:vectorType, v2:vectorType): number {
    return Math.sqrt( (v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) )
}
