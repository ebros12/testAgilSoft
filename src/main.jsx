import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Login } from './page/auth/Login.jsx'
import "materialize-css/dist/css/materialize.min.css";
import { store } from './store/store.js';
import { Provider } from 'react-redux';
import { AppRouter } from './routes/AppRouter.jsx';
import { BrowserRouter } from 'react-router-dom';




createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
    </Provider>
   
  </StrictMode>,
)
