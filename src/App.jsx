import { Routes, Route } from 'react-router-dom'
import ProfileSetup from './pages/ProfileSetup'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfileSetup />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  )
}

export default App
