import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DevelopmentAlert from './components/DevelopmentAlert';
import Beranda from './pages/Beranda';
import Information from './pages/Information';
import SeputarHimmah from './pages/SeputarHimmah';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen bg-[#004d24] font-poppins flex flex-col">
      <DevelopmentAlert />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/informasi" element={<Information />} />
          <Route path="/berita" element={<SeputarHimmah />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}