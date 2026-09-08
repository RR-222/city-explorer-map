import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root') || document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
