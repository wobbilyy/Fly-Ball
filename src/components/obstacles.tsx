import React from 'react';
import { useAppSelector } from '../redux/hooks';
import { bodyIdentificationMap } from '../library/body';
import { BAT_OFFSET, BAT_WIDTH, PLAYER_RADIUS, WINDOW_HEIGHT } from '../library/flyball';

import './obstacles.css';

import u_bat from '../assets/sprites/rotated_baseball_bat_game.png';
import l_bat from '../assets/sprites/baseball_bat_game.png';
import rod from '../assets/sprites/rod.png';

export default function obstacles() {

    const scene = useAppSelector((state)=> state.scene);
    const obstacles = scene.bodies.filter((body) => body.bodyInfo.bodyIdentification === bodyIdentificationMap.U_BAT || body.bodyInfo.bodyIdentification === bodyIdentificationMap.L_BAT); 

    return (
        <div>
            { obstacles.map( (body, index) => { return( 
                body.bodyInfo.bodyIdentification === bodyIdentificationMap.U_BAT ? 
                    <img src={u_bat} className={ "Bat" } style={{ left: body.position.x - BAT_WIDTH, bottom: WINDOW_HEIGHT / 2 + BAT_OFFSET }}/> : 
                    <img src={l_bat} className={ "Bat" } style={{ left: body.position.x - BAT_WIDTH, top: WINDOW_HEIGHT / 2 + BAT_OFFSET }}/>
                ); })
            }
        </div>
    );
}