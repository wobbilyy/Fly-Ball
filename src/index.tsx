import React from 'react'
import { createRoot }  from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store.tsx';
import Routes from './routes.tsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <Routes />
    </Provider>
);