import React, { useRef, useEffect } from 'react';

export const frameLoop = (callback:Function) => {
    const intervalID = useRef(0);
    const previousTime = useRef(0);

    const loop = (time:number) => {
        let dt:Number = time - previousTime.current;

        callback(time, dt);

        previousTime.current = time;
        intervalID.current = requestAnimationFrame(loop);
    }

    useEffect(() => {
        intervalID.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(intervalID.current);
    })
}