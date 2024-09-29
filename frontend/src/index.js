import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// ** Redux Imports
import { store } from './redux/store';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';

import { CookiesProvider } from 'react-cookie';
import FullScreenLoader from './components/FullScreenLoader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './assets/css/app-loader.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <CookiesProvider>
        <Suspense fallback={<FullScreenLoader />}>
          <App />
        </Suspense>
      </CookiesProvider>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
