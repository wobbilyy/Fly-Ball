import React from 'react';
import { frameLoop } from './library/utils.tsx';
import { useAppDispatch, useAppSelector } from './redux/hooks.tsx';
import { setScene } from './redux/sceneSlice.tsx';
import { flyballMain } from './library/flyball.tsx';

import StartButton from './components/startButton.tsx';
import GameOverScreen from './components/gameOverScreen.tsx';
import Player from './components/player.tsx';
import Ground from './components/ground.tsx';
import Obstacles from './components/obstacles.tsx';

import './game.css';

function Game() {

    const dispatch = useAppDispatch();

    const playing = useAppSelector((state) => state.gameState.playing);
    const dead = useAppSelector((state) => state.gameState.dead);

    const score = useAppSelector((state) => state.scene.score);
    const scene = useAppSelector((state) => state.scene);

    frameLoop( (time:number, dt:number) => {
        if (playing && !dead) {
            dispatch(setScene(flyballMain(scene, dt)));
        }
    });

    let width:HTMLElement = document.getElementById('Game-Container');

    return(
        <div className="Game" id='Game-Container'> 
            <p className='Title'> fly ball </p>
            <p className='Score'> {score} </p>

            { !playing && !dead && <StartButton restart={false} /> }
            { dead && <GameOverScreen />}

            <Player />
            <Obstacles />
            <Ground />
        </div>
    );
}

export default Game;
