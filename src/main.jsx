import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from "./redux/app/store";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <Provider store={store}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                  <App/>
              </LocalizationProvider>
          </Provider>
      </BrowserRouter>
  </StrictMode>,
)
