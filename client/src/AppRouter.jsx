import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App';
import Cart from './components/cart-page/Cart';
import HistoryPage from './components/history-page/HistoryPage';


export default function AppRouter() {
  return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<App/>}></Route>
                <Route path={'/app/cart'} element={<Cart/>}></Route>
                <Route path={'/app/history'} element={<HistoryPage/>}></Route>
            </Routes>
        </BrowserRouter>
  )
}
