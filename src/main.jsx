import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TanstackProvider } from '../tanstack.jsx';
import { Provider } from 'react-redux';
import { store } from '../redux/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TanstackProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </TanstackProvider>
  </StrictMode>,
)
