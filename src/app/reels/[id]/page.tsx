import ReelPlayer from "@/components/ReelPlayer";

export default function ReelPage({ params }: { params:{ id:string } }){
  const title = params.id==="demo123" ? "The Door in the Fridge" : "Untitled Reel";
  const scenes = [
    { caption:"Maya opens her fridge and finds a door where the milk should be.", imageUrl: `/api/media/image?prompt=cinematic%20fridge%20interior%20with%20glowing%20wooden%20door%20photorealistic%20portrait%209:16&seed=101&width=1080&height=1920` },
    { caption:"Last Tuesday is waiting on the other side, still warm.", imageUrl: `/api/media/image?prompt=time%20portal%20kitchen%20surreal%20warm%20light%20cinematic&seed=102&width=1080&height=1920` },
    { caption:"She steps through. Tuesday remembers her.", imageUrl: `/api/media/image?prompt=girl%20stepping%20through%20glowing%20portal%20portrait%20cinematic&seed=103&width=1080&height=1920` },
    { caption:"And suddenly, the fridge is just a fridge again.", imageUrl: `/api/media/image?prompt=quiet%20kitchen%20at%20night%20cinematic%20portrait&seed=104&width=1080&height=1920` },
  ];
  return (
    <div className="max-w-[700px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <p className="text-center text-sm text-text-mid">Reel {params.id} • Tap to navigate • 🔊 Browser TTS narration</p>
      <div className="mt-6 flex justify-center">
        <ReelPlayer title={title} scenes={scenes} />
      </div>
      <p className="text-center text-xs text-text-low mt-4">Images proxied via /api/media/image (gen.pollinations.ai) • Audio via window.speechSynthesis — no voiceUrl, no hosted files</p>
    </div>
  )
}
