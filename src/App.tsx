/* src/App.tsx - Main Router */
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import ClientLauncher from './pages/ClientLauncher';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientLauncher />} />
      </Routes>
    </Router>
  );
}

export default App;
