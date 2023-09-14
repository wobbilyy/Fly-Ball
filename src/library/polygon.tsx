import { bodySetCentroid } from "./body";
import { VEC_ZERO, vectorAdd, vectorNegate, vectorRotate, vectorType } from "./vector.tsx";

export const NUMBER_VECTORS = 100;

export function polygonArea(polygon:vectorType[]): number {
    let area:number = 0.0;

    for (let i:number = 0; i < polygon.length; i++) {
        let j:number = (i + 1) % polygon.length;
    
        area += polygon[i].x * polygon[j].y;
        area -= polygon[j].x * polygon[i].y;
    }

    return area / 2.0;
}

export function polygonCentroid(polygon:vectorType[]): vectorType {
    let result:vectorType;

    let area:number = polygonArea(polygon);
    let x:number = 0.0;
    let y:number = 0.0;

    for (let i:number = 0; i < polygon.length; i++) {
        let j:number = (i + 1) % polygon.length;

        let point_i:vectorType = polygon[i];
        let point_j:vectorType = polygon[j];

        x += (point_i.x + point_j.x) * (point_i.x * point_j.y - point_j.x * point_i.y);
        y += (point_i.y + point_j.y) * (point_i.x * point_j.y - point_j.x * point_i.y);
    }

    x /= 6 * area;
    y /= 6 * area;

    result = { x: x, y: y };

    return result;
}

export function polygonTranslate(polygon:vectorType[], translation:vectorType): void {
    for (let i:number = 0; i < polygon.length; i++) {      
        let translated:vectorType = vectorAdd(polygon[i], translation);

        polygon[i] = translated;
    }
}

export function polygonRotate(polygon:vectorType[], angle:number, point:vectorType): void {
    polygonTranslate(polygon, vectorNegate(point));

    for (let i:number = 0; i < polygon.length; i++) {
        let rotated:vectorType = vectorRotate(polygon[i], angle);

        polygon[i] = rotated;
    }
    
    polygonTranslate(polygon, point);
}

export function makeCircle(radius:number): vectorType[] {
    let vectors:vectorType[] = [];

    let angle:number = 2 * Math.PI / NUMBER_VECTORS;
    
    for (let i:number = 0; i < NUMBER_VECTORS; i++) {
        polygonRotate(vectors, angle, VEC_ZERO);

        vectors.push( { x: 0, y: radius} );
    }

    return vectors;
}
