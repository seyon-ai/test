export default function EditReel({params}:{params:{id:string}}){
  return (<div className="max-w-[700px] mx-auto px-6 py-12"><h1 className="text-2xl font-bold">Edit Reel {params.id}</h1><p className="text-text-mid">Edit captions or regenerate a scene image (calls /api/media/image proxy with new prompt & seed).</p><div className="glass rounded-2xl p-6 mt-6 space-y-3"><input placeholder="Caption" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm"/><button className="metallic px-4 py-2 rounded-full text-sm font-semibold">Regenerate Image</button></div></div>)
}
