import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { frameLoop } from '../library/utils';
import bodyType, { bodyAddForce, bodyIdentificationMap, bodyInit, bodySetCentroid } from '../library/body';
import { addBody, addForce, setScene } from '../redux/sceneSlice';
import { forceInfoType, sceneCopy, sceneTick } from '../library/scene';
import { createDrag, createNewtonianGravity } from '../library/force';

import Button from '@mui/material/Button';

import './player.css';
import '../game.css';

import player from '../assets/sprites/player.png';


export default function Tester() {
    const dispatch = useAppDispatch();

    const scene = useAppSelector((state) => state.scene);
    const sceneBodies = useAppSelector((state) => state.scene.bodies);
    const sceneForces = useAppSelector((state) => state.scene.forces);

    const addTwoBodies = (event:any) => {
        let body:bodyType = bodyInit([{ x: 0, y: 0 }, { x: 0, y: 1  }, { x: 1, y: 1  }, { x: 1, y: 0  }], 1500, { bodyIdentification:bodyIdentificationMap.WALL, remove:false });
        let b2:bodyType = bodyInit([{ x: 0, y: 0 }, { x: 0, y: 1  }, { x: 1, y: 1  }, { x: 1, y: 0  }], 1000, { bodyIdentification:bodyIdentificationMap.PLAYER, remove:false });
        bodySetCentroid(body, { x: 500, y:400 });
        bodySetCentroid(b2, { x: 500, y:100 });
        dispatch(addBody(body));
        dispatch(addBody(b2));
    };

    const addForceBetweenTwo = (event:any) => {
        let force:forceInfoType = createNewtonianGravity(scene, 9.8, 0, 1);

        let d1:forceInfoType = createDrag(scene, 1, 0);
        let d2:forceInfoType = createDrag(scene, 1, 1);

        dispatch(addForce(force));
        dispatch(addForce(d1));
        dispatch(addForce(d2));
    };

    // const tickTheGodDamnScene = (event:any) => {
    //     let copy = sceneCopy(scene);

    //     dispatch(setScene(sceneTick(copy, 1)));
    // };

    frameLoop( (time:number, dt:number) => {
        if (sceneForces.length > 0) {
            let copy = sceneCopy(scene);

            dispatch(setScene(sceneTick(copy, dt / 100)));
        }
    });

    return (
        <div className="Game"> 
            <p className='Title'> test environment </p>

            {/* { sceneBodies.length === 0 ? 
                <Button onClick={(e) => addTwoBodies(e)} variant='contained'> add two bodies </Button> : 
                sceneForces.length === 0 ? 
                <Button onClick={(e) => addForceBetweenTwo(e)} variant='contained'> add gravity between two </Button> :
                <Button onClick={(e) => tickTheGodDamnScene(e)} variant='contained'> tick the god damn scene </Button>
            } */}
            
            { sceneBodies.length === 0 ? 
                <Button onClick={(e) => addTwoBodies(e)} variant='contained'> add two bodies </Button> : 
                <Button onClick={(e) => addForceBetweenTwo(e)} variant='contained'> add gravity between two </Button>
            }

            {/* {sceneBodies.map((b, i) => { return (<p> { JSON.stringify(b)}  </p>) })} */}
            {/* <img src={player} className={"Player Float"} style={{ }}/> */}

            <p> {JSON.stringify(sceneBodies)} </p>

            { sceneBodies.map((b, i) => { return (<img src={player} className={"Player Spin"} style={{ left: b.position.x, bottom: b.position.y }}/>) }) }
        </div>
    );
}