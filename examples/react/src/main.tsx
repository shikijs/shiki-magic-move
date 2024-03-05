import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import '../../../src/style.css'
import '@unocss/reset/tailwind.css'
import 'uno.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
