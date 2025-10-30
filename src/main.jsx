import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from '../context/AppContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from '../context/SocketContext.jsx'
import { AppNotificationListener } from './hooks/notifications.js'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AppNotificationListener />
        <App />
      </SocketProvider>
    </QueryClientProvider>
  </AppContextProvider>,
)
