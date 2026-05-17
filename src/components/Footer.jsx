import { useState } from 'react';
import { MapPin, Phone, Mail, Copy, Check } from 'lucide-react';
import { socialMedia, contactInfo } from '../data/config';

export default function Footer() {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Gagal menyalin:', err);
    }
  };

  // Ikon SVG kustom untuk media sosial
  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );

  return (
    <footer className="bg-[#002b13] border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-playfair font-bold text-lg mb-3">HIMMAH NW</h3>
            <p className="text-green-300/60 text-sm">Himpunan Mahasiswa Nahdlatul Wathan</p>
            <p className="text-green-300/50 text-xs mt-2">Komisariat STMIK</p>
          </div>

          {/* Kontak + copy */}
          <div>
            <h4 className="text-white font-semibold mb-3">Kontak</h4>
            <div className="space-y-2 text-green-300/60 text-sm">
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-green-400 flex-shrink-0" />
                {contactInfo.address}
              </p>
              <button
                onClick={() => copyToClipboard(contactInfo.phone, 'phone')}
                className="flex items-center gap-2 hover:text-green-300 transition-colors w-full text-left"
                title="Salin nomor telepon"
              >
                <Phone size={14} className="text-green-400 flex-shrink-0" />
                <span>{contactInfo.phone}</span>
                {copied === 'phone' ? (
                  <Check size={14} className="text-green-400 ml-1" />
                ) : (
                  <Copy size={14} className="text-green-400/50 ml-1" />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(contactInfo.email, 'email')}
                className="flex items-center gap-2 hover:text-green-300 transition-colors w-full text-left"
                title="Salin alamat email"
              >
                <Mail size={14} className="text-green-400 flex-shrink-0" />
                <span>{contactInfo.email}</span>
                {copied === 'email' ? (
                  <Check size={14} className="text-green-400 ml-1" />
                ) : (
                  <Copy size={14} className="text-green-400/50 ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Media Sosial */}
          <div>
            <h4 className="text-white font-semibold mb-3">Media Sosial</h4>
            <div className="flex gap-3">
              <a
                href={socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-green-300 hover:text-white transition-all text-sm"
                title="Instagram"
              >
                <InstagramIcon /> Instagram
              </a>
              <a
                href={socialMedia.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-green-300 hover:text-white transition-all text-sm"
                title="Saluran WhatsApp"
              >
                <WhatsAppIcon /> WhatsApp
              </a>
              <a
                href={socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-green-300 hover:text-white transition-all text-sm"
                title="Facebook"
              >
                <FacebookIcon /> Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-green-300/40 text-xs">
          &copy; {new Date().getFullYear()} HIMMAH NW Komisariat STMIK. WEBSITE MASIH DALAM TAHAP PENGEMBANGAN.
        </div>
      </div>
    </footer>
  );
}