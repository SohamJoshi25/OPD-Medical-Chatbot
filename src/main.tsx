import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import {ResponseProvider} from './contexts/responseContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResponseProvider>
      <App />
    </ResponseProvider>
  </StrictMode>,
)
