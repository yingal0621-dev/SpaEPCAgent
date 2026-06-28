import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import StackViewPage from './pages/StackViewPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StackViewPage />} />
        <Route path="/search" element={<StackViewPage />} />
        <Route path="/customer/:customerId" element={<StackViewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
