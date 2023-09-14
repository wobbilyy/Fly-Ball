import React, { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setDead, setReady } from '../redux/gameStateSlice';
import { setBodies } from '../redux/sceneSlice';
import { BAT_OFFSET, BAT_WIDTH, PLAYER_RADIUS, WINDOW_HEIGHT, jump, jumpA, jumpD, jumpS, jumpW } from '../library/flyball';
import { bodyIdentificationMap } from '../library/body';

import './player.css';

import player from '../assets/sprites/player.png';

export default function Player() {

    const dispatch = useAppDispatch();

    const playing = useAppSelector((state) => state.gameState.playing);
    const dead = useAppSelector((state) => state.gameState.dead);
    const scene = useAppSelector((state) => state.scene);

    const sceneRef = useRef(scene);
    sceneRef.current = scene;

    let className = "Player";
    if (!playing && !dead) {
        className += " Float"
    } else {
        if (!dead) {
            className += " Fly"
        }
    }

    const onKey = useCallback((e:KeyboardEvent) => {
        if (e.repeat) {
            return;
        } else if ( (e.code === "KeyW" || e.code === "Space") && !dead) {
            dispatch(setBodies(jump(sceneRef.current.bodies)));
        } 
    }, []);

    // const onKey = useCallback((e:KeyboardEvent) => {
    //     if (e.repeat) {
    //         return;
    //     } else if ( (e.code === "KeyW" || e.code === "Space") && !dead) {
    //         dispatch(setBodies(jumpW(sceneRef.current.bodies)));
    //     } else if ( (e.code === "KeyS" || e.code === "Space") && !dead) {
    //         dispatch(setBodies(jumpS(sceneRef.current.bodies)));
    //     } else if ( (e.code === "KeyA" || e.code === "Space") && !dead) {
    //         dispatch(setBodies(jumpA(sceneRef.current.bodies)));
    //     } else if ( (e.code === "KeyD" || e.code === "Space") && !dead) {
    //         dispatch(setBodies(jumpD(sceneRef.current.bodies)));
    //     } 
    // }, []);

    useEffect(() => {
        if (dead) {
            document.removeEventListener("keydown", onKey);
        } else if (playing) {
            document.addEventListener("keydown", onKey);
        }
    }, [playing, dead]);

    useEffect(() => {
        if (scene.bodies[0].bodyInfo.bodyIdentification !== bodyIdentificationMap.PLAYER || scene.bodies[0].bodyInfo.checked) {
            dispatch(setDead(true)); 
            dispatch(setReady(false));
        } 
    }, [scene]);
    
    return (
        <div >
            <img src={player} className={ className } style={{ left: scene.bodies[0].position.x - PLAYER_RADIUS, bottom: scene.bodies[0].position.y - PLAYER_RADIUS }}/>
        </div>
    );
}