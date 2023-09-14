import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import gameStateSlice, { setDead, setReady } from '../redux/gameStateSlice';
import { setScene } from '../redux/sceneSlice';
import { flyballInit } from '../library/flyball';

import { Button, IconButton } from '@mui/material';
import Fingerprint from '@mui/icons-material/Fingerprint';

interface startButtonProps {
    restart: boolean;
}

export default function startButton( props:startButtonProps ) {

    const dispatch = useAppDispatch();

    const username = useAppSelector((state) => state.gameState.name);
    const dead = useAppSelector((state) => state.gameState.dead);

    const onClick = (e:any) => {
        if (!props.restart) {
            dispatch(setReady(true));
        }
        dispatch(setScene(flyballInit()));
        dispatch(setDead(false));
    }

    return(
        <div>
            { !dead && <IconButton aria-label="fingerprint" size="large" onClick={onClick} style={{ color: 'white' }}> <Fingerprint /> </IconButton> }
            { dead && <Button onClick={onClick} style={{ color: 'white' }}> Play Again! </Button> } 
        </div>
    );
}