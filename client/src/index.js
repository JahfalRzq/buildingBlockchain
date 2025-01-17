import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './index.css';
import { Router, Routes, Route } from 'react-router-dom';
import history from './history';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';



const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(  
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/blocks" element={<Blocks/>} />
        <Route path='/conduct-transaction' element={<ConductTransaction/>} />
        <Route path='/transaction-pool' element={<TransactionPool/>} />
      </Routes>
    </Router>
);