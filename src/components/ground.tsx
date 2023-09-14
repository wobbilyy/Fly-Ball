import React from 'react';

import './ground.css';

import ground from '../assets/background/background_floor.png';
import { useAppSelector } from '../redux/hooks';

export default function Ground() {

    const playing = useAppSelector((state) => state.gameState.playing);
    const dead = useAppSelector((state) => state.gameState.dead);

    const translate = playing && !dead ? "Translate" : "";

    return (
        <div>
            <img src={ground} className={'Ground ' + translate} />
            <img src={ground} className={'Ground2 ' +  translate} />
            <img src={ground} className={'Ground3 ' +  translate} />
        </div>
    );
}