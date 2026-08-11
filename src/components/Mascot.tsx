export default function Mascot({ size=48, bob=true }: { size?: number, bob?: boolean }){
  return (
    <div style={{width:size, height:size}} className={`${bob?"animate-bob":""}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]">
        <ellipse cx="50" cy="88" rx="28" ry="6" fill="rgba(255,255,255,0.08)" />
        {/* body */}
        <path d="M30 55 Q28 30 50 22 Q72 30 70 55 Q70 75 50 82 Q30 75 30 55Z" fill="#E8EAED" stroke="#C7CBD1" strokeWidth="1.5"/>
        {/* neck + head */}
        <path d="M50 22 Q52 12 62 10 Q72 8 74 18 Q74 28 62 30 Q55 32 50 22Z" fill="#E8EAED" stroke="#C7CBD1" strokeWidth="1.5"/>
        {/* beak graphite */}
        <path d="M74 16 Q82 16 84 20 Q82 24 74 22Z" fill="#6B6D73" stroke="#8A8D93" />
        {/* eye side-eye */}
        <circle cx="62" cy="18" r="4.5" fill="#0A0A0B" />
        <circle cx="63.5" cy="17" r="1.4" fill="white" />
        {/* wing */}
        <path d="M38 45 Q42 52 46 48 Q44 60 36 58 Q32 52 38 45Z" fill="#C7CBD1" opacity="0.9"/>
        <text x="50" y="62" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0A0A0B" style={{fontFamily:"Poppins"}}>IGMA</text>
      </svg>
    </div>
  )
}
