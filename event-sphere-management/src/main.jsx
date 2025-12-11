import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@mdi/font/css/materialdesignicons.min.css'
import './index.css'
import App from './App.jsx'

// #region agent log
fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.jsx:8',message:'App initialization started',data:{rootExists:!!document.getElementById('root')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// #region agent log
fetch('http://127.0.0.1:7242/ingest/0256a869-b573-41db-a6db-d41a33bb5131',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.jsx:15',message:'App rendered successfully',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion
