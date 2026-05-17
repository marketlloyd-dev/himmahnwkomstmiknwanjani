import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DevelopmentAlert() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 max-w-xl w-full text-left">
        <AlertTriangle size={24} className="text-red-400 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-red-400 font-bold uppercase text-sm tracking-wider">PERHATIAN</h4>
          <p className="text-red-300/80 text-sm mt-0.5">
            Web ini masih dalam tahap pengembangan / sedang mencari data valid.
          </p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-red-400 hover:text-red-300 flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}