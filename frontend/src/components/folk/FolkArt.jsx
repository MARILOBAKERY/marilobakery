// Soft Matisse-inspired abstract shapes for bohemian backgrounds

export const Blob1 = ({ className = "", color = "#E27282" }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M44 88 C 30 50, 78 14, 118 30 C 160 22, 192 70, 178 110 C 196 152, 144 192, 100 180 C 56 196, 14 158, 28 118 C 16 100, 36 92, 44 88 Z" fill={color}/>
  </svg>
);

export const Blob2 = ({ className = "", color = "#8FBAC5" }) => (
  <svg viewBox="0 0 220 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 100 Q 0 40, 80 30 Q 140 0, 190 50 Q 230 110, 180 160 Q 130 210, 70 180 Q 10 170, 20 100 Z" fill={color}/>
  </svg>
);

export const Squiggle = ({ className = "", color = "#E27282" }) => (
  <svg viewBox="0 0 240 30" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 15 Q 30 0, 56 15 T 110 15 T 165 15 T 218 15 T 236 15" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

export const SquiggleLoop = ({ className = "", color = "#ADC388" }) => (
  <svg viewBox="0 0 120 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 70 Q 30 10, 60 40 T 110 40" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <path d="M40 30 C 50 10, 70 10, 80 30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const Dots = ({ className = "", color = "#000" }) => (
  <svg viewBox="0 0 120 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 18 }).map((_, i) => (
      <circle key={i} cx={(i % 6) * 22 + 6} cy={Math.floor(i / 6) * 26 + 6} r="2.5" fill={color}/>
    ))}
  </svg>
);

export const Leaf = ({ className = "", color = "#ADC388" }) => (
  <svg viewBox="0 0 80 110" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M40 4 C 12 24, 6 70, 40 106 C 74 70, 68 24, 40 4 Z" fill={color}/>
    <path d="M40 8 L40 100" stroke="#000" strokeWidth="1.2" opacity="0.5"/>
  </svg>
);

export const Flower = ({ className = "", color = "#fdda25" }) => (
  <svg viewBox="0 0 80 80" className={className} xmlns="http://www.w3.org/2000/svg">
    {[0, 72, 144, 216, 288].map((deg) => (
      <ellipse key={deg} cx="40" cy="20" rx="9" ry="14" fill={color} transform={`rotate(${deg} 40 40)`}/>
    ))}
    <circle cx="40" cy="40" r="7" fill="#E27282"/>
  </svg>
);

export const Sun = ({ className = "", color = "#fdda25" }) => (
  <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i * 36 * Math.PI) / 180;
      const x1 = 60 + Math.cos(a) * 36;
      const y1 = 60 + Math.sin(a) * 36;
      const x2 = 60 + Math.cos(a) * 54;
      const y2 = 60 + Math.sin(a) * 54;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeLinecap="round"/>;
    })}
    <circle cx="60" cy="60" r="28" fill={color}/>
  </svg>
);

export const ScribblePattern = ({ className = "" }) => (
  <svg viewBox="0 0 400 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <path d="M-20 40 Q 60 0, 140 50 T 320 50 T 440 60" stroke="#ADC388" strokeWidth="3" strokeLinecap="round"/>
    <path d="M-20 120 Q 80 80, 160 130 T 340 130 T 440 140" stroke="#E27282" strokeWidth="3" strokeLinecap="round" opacity="0.7"/>
    <path d="M-20 220 Q 100 180, 180 230 T 360 230 T 440 240" stroke="#8FBAC5" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="50" cy="180" r="6" fill="#fdda25"/>
    <circle cx="180" cy="80" r="5" fill="#E27282"/>
    <circle cx="320" cy="200" r="7" fill="#ADC388"/>
    <path d="M260 30 q 8 -10 16 0 t 16 0" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M80 270 q 8 -10 16 0 t 16 0" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round"/>
  </svg>
);
