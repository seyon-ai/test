export async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if(!key) throw new Error("Missing NEXT_PUBLIC_IMGBB_API_KEY — get one free at api.imgbb.com");
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method:"POST", body: form });
  const json = await res.json();
  if(!json.success) throw new Error(json.error?.message || "imgbb upload failed");
  return json.data.url as string;
}
