import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Leaf } from 'lucide-react';
import ProductForm from './components/ProductForm';
import Logs from './components/Logs';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
                  <Leaf className="w-6 h-6" />
                  EcoCategorize AI
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Analyzer</Link>
                <Link to="/logs" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">Logs Audit</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ProductForm />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto py-6 text-center text-gray-500 text-sm">
          Applied AI Sustainable Commerce Platform Engine
        </footer>
      </div>
    </Router>
  );
}

export default App;
