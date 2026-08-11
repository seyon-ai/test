export default function PostPage({params}:{params:{id:string}}){
  return (<div className="max-w-[640px] mx-auto px-6 py-12"><h1 className="text-2xl font-bold">Story {params.id}</h1><div className="glass rounded-2xl p-6 mt-6"><p className="text-text-mid">Permalink view — reaction, likes, comments (Firestore stories/id + subcollection comments).</p><div className="mt-4 h-24 bg-white/5 rounded-xl shimmer"/></div></div>)
}
