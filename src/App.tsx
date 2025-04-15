// Packages
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//Pages
import Home from './pages/home/Home.tsx'
import PageNotFound from './pages/not-found/NotFoundPage.tsx';
import Chat from './pages/chatbot/Chat.tsx';
import ChatV1 from "./pages/chatbot-chat/Chat.tsx"
import Response from './pages/response/Response.tsx';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatV1 />} />
          <Route path="/voice" element={<Chat />} />
          <Route path="/response" element={<Response />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App