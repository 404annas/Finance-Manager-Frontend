import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from '../context/AppContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SocketProvider } from '../context/SocketContext.jsx'
import { NotificationProvider } from '../context/NotificationContext.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </SocketProvider>
    </QueryClientProvider>
  </AppContextProvider>,
)
