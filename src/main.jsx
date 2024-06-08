import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { IconContext } from 'react-icons'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <IconContext.Provider value={{ className: 'react-icons', verticalAlign: 'middle' }}>
    <App />
    </IconContext.Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
