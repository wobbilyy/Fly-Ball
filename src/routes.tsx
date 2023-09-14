import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./redux/hooks";
import Game from './game.tsx';
import Window from './components/window.tsx';
import Tester from './components/testEnvironment.tsx';
import LoadScreen from './components/startButton.tsx';

function App() {
    return (
        <>
            {<Game />}
            {/* {<Tester />} */}
        </>
    );
}

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;