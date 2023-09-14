import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import StartButton from './startButton.tsx';

import '../game.css';

export default function gameOverScreen() {

    return(
        <div className='Score'>
            {/* <p> GAME OVER :/ </p> */}
            <StartButton restart={true} />
        </div>
    );
}