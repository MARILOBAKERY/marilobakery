// Mexican folk art SVG decorations — milagros, soles, ojos, llamas, hojas
// All accept className for positioning + sizing.

export const SacredHeart = ({ className = "", color = "#f9557c" }) => (
  <svg viewBox="0 0 120 140" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* flame/rays */}
    <path d="M60 4 L66 18 L74 8 L72 22 L86 14 L78 28 L92 28 L82 38" stroke="#fdda25" strokeWidth="3" fill="#fdda25" strokeLinejoin="round"/>
    <path d="M60 4 L54 18 L46 8 L48 22 L34 14 L42 28 L28 28 L38 38" stroke="#fdda25" strokeWidth="3" fill="#fdda25" strokeLinejoin="round"/>
    {/* heart body */}
    <path d="M60 130 C 20 100, 8 70, 22 50 C 32 36, 50 38, 60 54 C 70 38, 88 36, 98 50 C 112 70, 100 100, 60 130 Z" fill={color} stroke="#000" strokeWidth="2.5"/>
    {/* dotted border */}
    <path d="M60 130 C 20 100, 8 70, 22 50 C 32 36, 50 38, 60 54 C 70 38, 88 36, 98 50 C 112 70, 100 100, 60 130 Z" fill="none" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 3"/>
    {/* center sparkle */}
    <circle cx="60" cy="80" r="6" fill="#fdda25" stroke="#000" strokeWidth="1.5"/>
    <path d="M52 72 L68 88 M68 72 L52 88" stroke="#000" strokeWidth="1.2"/>
  </svg>
);

export const FlamingSun = ({ className = "" }) => (
  <svg viewBox="0 0 140 140" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* rays */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * 30 * Math.PI) / 180;
      const x1 = 70 + Math.cos(a) * 40;
      const y1 = 70 + Math.sin(a) * 40;
      const x2 = 70 + Math.cos(a) * 62;
      const y2 = 70 + Math.sin(a) * 62;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fdda25" strokeWidth="5" strokeLinecap="round"/>;
    })}
    {/* face */}
    <circle cx="70" cy="70" r="34" fill="#fdda25" stroke="#000" strokeWidth="2.5"/>
    <circle cx="60" cy="65" r="2.5" fill="#000"/>
    <circle cx="80" cy="65" r="2.5" fill="#000"/>
    <path d="M58 80 Q70 90 82 80" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* cheek blush */}
    <circle cx="55" cy="76" r="3" fill="#f9557c" opacity="0.6"/>
    <circle cx="85" cy="76" r="3" fill="#f9557c" opacity="0.6"/>
  </svg>
);

export const Moon = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M70 12 C 38 18, 22 50, 38 80 C 50 92, 70 88, 78 80 C 50 78, 30 50, 50 22 C 56 16, 64 12, 70 12 Z" fill="#fdda25" stroke="#000" strokeWidth="2"/>
    <circle cx="55" cy="40" r="2" fill="#000"/>
    <path d="M50 52 Q55 58 60 52" stroke="#000" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const ProtectiveEye = ({ className = "" }) => (
  <svg viewBox="0 0 140 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* outer almond */}
    <path d="M10 50 Q 70 4 130 50 Q 70 96 10 50 Z" fill="#b2f0e8" stroke="#000" strokeWidth="2.5"/>
    {/* iris */}
    <circle cx="70" cy="50" r="22" fill="#21dfc8" stroke="#000" strokeWidth="2"/>
    <circle cx="70" cy="50" r="10" fill="#000"/>
    <circle cx="74" cy="46" r="3" fill="#fff"/>
    {/* lashes */}
    {Array.from({ length: 7 }).map((_, i) => {
      const x = 28 + i * 14;
      return <line key={i} x1={x} y1="18" x2={x + (i - 3) * 2} y2="6" stroke="#000" strokeWidth="2" strokeLinecap="round"/>;
    })}
  </svg>
);

export const TealLeaf = ({ className = "" }) => (
  <svg viewBox="0 0 100 140" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M50 6 C 20 30, 10 80, 50 134 C 90 80, 80 30, 50 6 Z" fill="#21dfc8" stroke="#000" strokeWidth="2"/>
    <path d="M50 6 L50 134" stroke="#000" strokeWidth="1.5"/>
    {Array.from({ length: 6 }).map((_, i) => {
      const y = 30 + i * 16;
      const r = 12 + i * 4;
      return (
        <g key={i}>
          <line x1="50" y1={y} x2={50 - r} y2={y + 10} stroke="#000" strokeWidth="1"/>
          <line x1="50" y1={y} x2={50 + r} y2={y + 10} stroke="#000" strokeWidth="1"/>
        </g>
      );
    })}
  </svg>
);

export const StarSparkle = ({ className = "", color = "#fdda25" }) => (
  <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2 L23 17 L38 20 L23 23 L20 38 L17 23 L2 20 L17 17 Z" fill={color} stroke="#000" strokeWidth="1.2"/>
  </svg>
);

export const Squiggle = ({ className = "", color = "#f9557c" }) => (
  <svg viewBox="0 0 200 30" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 15 Q 25 2, 50 15 T 100 15 T 150 15 T 198 15" stroke={color} strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

export const PaintedBlob = ({ className = "", color = "#ffb3cd" }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M40 70 C 20 40, 60 10, 100 25 C 140 5, 180 35, 175 80 C 195 110, 170 165, 130 170 C 100 195, 50 185, 35 150 C 5 130, 20 90, 40 70 Z" fill={color} opacity="0.85"/>
  </svg>
);

export const SnakeSquiggle = ({ className = "" }) => (
  <svg viewBox="0 0 220 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20 Q 30 4, 55 20 T 110 20 T 165 20 T 215 20" stroke="#f9557c" strokeWidth="6" strokeLinecap="round"/>
    <path d="M4 20 Q 30 4, 55 20 T 110 20 T 165 20 T 215 20" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 6"/>
    <circle cx="216" cy="20" r="5" fill="#f9557c" stroke="#000" strokeWidth="1.5"/>
    <circle cx="217" cy="18" r="1.2" fill="#000"/>
  </svg>
);
