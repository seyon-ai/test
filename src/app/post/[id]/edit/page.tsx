export default function EditPost({params}:{params:{id:string}}){
  return (<div className="max-w-[640px] mx-auto px-6 py-12"><h1 className="text-2xl font-bold">Edit Story {params.id}</h1><textarea className="w-full mt-4 bg-white/5 border border-white/10 rounded-xl p-4 min-h-[120px] text-sm" defaultValue="Your story text..."/><button className="mt-3 metallic px-6 py-2 rounded-full text-sm font-semibold">Save</button></div>)
}
