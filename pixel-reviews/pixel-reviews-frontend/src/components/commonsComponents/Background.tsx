export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0a]">
      {/* Patrón de puntos sutil */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      
      {/* Vignette sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
    </div>
  );
}
