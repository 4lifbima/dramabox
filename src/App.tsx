import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Trending from './pages/Trending';
import Latest from './pages/Latest';
import Search from './pages/Search';
import DramaDetail from './pages/DramaDetail';
import Watch from './pages/Watch';
import DubIndo from './pages/DubIndo';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/latest" element={<Latest />} />
          <Route path="/search" element={<Search />} />
          <Route path="/drama/:bookId" element={<DramaDetail />} />
          <Route path="/watch/:bookId/:episodeIndex" element={<Watch />} />
          <Route path="/dubindo" element={<DubIndo />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
