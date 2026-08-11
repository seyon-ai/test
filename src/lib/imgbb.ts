export async function uploadToImgbb(file: File): Promise<string> {
  // Support both Vercel var names — user added IMGBB_API_KEY but code expected NEXT_PUBLIC_IMGBB_API_KEY
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY || (process.env as any).IMGBB_API_KEY || (process.env as any).NEXT_PUBLIC_IMGBB_KEY;
  if(!key) throw new Error("Missing imgbb key — add NEXT_PUBLIC_IMGBB_API_KEY (or IMGBB_API_KEY) in Vercel → Settings → Environment Variables → Redeploy");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method:"POST", body: form });
  const json = await res.json();
  if(!json.success) throw new Error(json.error?.message || "imgbb upload failed");
  return json.data.url as string;
}
