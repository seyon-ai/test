export default function Admin(){
  return (<div className="max-w-[1100px] mx-auto px-6 py-8">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    <p className="text-text-mid">Protected — owner/admin only (verify Firebase ID token + role).</p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {[
        ["Total Users","12.4k","+8%"],
        ["Stories","48.2k","+12%"],
        ["Reels","6.1k","+22%"],
        ["Groq Calls","1.2M","78% quota"],
      ].map(([k,v,s])=>(
        <div key={k} className="glass rounded-2xl p-5"><p className="text-xs text-silver-dim">{k}</p><p className="text-2xl font-bold mt-1">{v}</p><p className="text-xs text-emerald-400">{s}</p></div>
      ))}
    </div>
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      <div className="glass rounded-2xl p-6 md:col-span-2">
        <h3 className="font-semibold">API Usage (Live)</h3>
        <div className="mt-4 space-y-3">
          {[
            ["Groq llama-3.3",70],
            ["Pollinations images",45],
            ["imgbb uploads",20],
          ].map(([l,p])=>(
            <div key={l as string}><div className="flex justify-between text-xs"><span>{l as string}</span><span>{p as number}%</span></div><div className="h-2 bg-white/10 rounded-full mt-1 overflow-hidden"><div className="h-full metallic" style={{width:p+"%"}} /></div></div>
          ))}
        </div>
      </div>
      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold">Moderation Queue</h3>
        <p className="text-3xl font-bold mt-2">7</p><p className="text-xs text-silver-dim">Reports pending</p>
        <a href="/admin/reports" className="mt-4 inline-block metallic px-4 py-2 rounded-full text-xs font-semibold">Open Queue</a>
      </div>
    </div>
    <div className="glass rounded-2xl p-6 mt-6">
      <h3 className="font-semibold">Recent Activity</h3>
      <div className="mt-3 space-y-2 text-sm text-text-mid">
        <p>• @mara_night published “Midnight Library” reel — 298 likes in 2h</p>
        <p>• Groq rate: 12 req/s (limit 30/s) — healthy</p>
        <p>• Pollinations proxy hit rate 94% — cache working</p>
      </div>
    </div>
  </div>)
}
