import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ScrapDrivers from './pages/ScrapDrivers'
import ScrapRecords from './pages/ScrapRecords'
import UploadCSV from './pages/UploadCSV'
import UploadDocs from './pages/UploadDocs'
import RCAPage from './pages/RCAPage'
import Actions from './pages/Actions'
import Impact from './pages/Impact'
import Chatbot from './pages/Chatbot'
import Reports from './pages/Reports'
import Connectors from './pages/Connectors'
import AdminUsers from './pages/AdminUsers'
import KnowledgeGraph from './pages/KnowledgeGraph'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="drivers" element={<ScrapDrivers />} />
        <Route path="records" element={<ScrapRecords />} />
        <Route path="upload-csv" element={<ProtectedRoute adminOnly><UploadCSV /></ProtectedRoute>} />
        <Route path="upload-docs" element={<ProtectedRoute adminOnly><UploadDocs /></ProtectedRoute>} />
        <Route path="rca" element={<RCAPage />} />
        <Route path="actions" element={<Actions />} />
        <Route path="impact" element={<Impact />} />
        <Route path="graph" element={<KnowledgeGraph />} />
        <Route path="chat" element={<Chatbot />} />
        <Route path="reports" element={<Reports />} />
        <Route path="connectors" element={<ProtectedRoute adminOnly><Connectors /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
