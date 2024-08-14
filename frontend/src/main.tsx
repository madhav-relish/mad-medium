import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@mantine/tiptap/styles.css';
import '@mantine/core/styles.css';
import { ThemeContext } from './context/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContext.Provider value='dark'>
    
    <App />
    </ThemeContext.Provider>
  </React.StrictMode>,
)
