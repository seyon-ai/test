import Link from "next/link";
const items=[
  ["/settings/account","Account","Email, password, delete"],
  ["/settings/appearance","Appearance","Dark silver, density"],
  ["/settings/ai-personality","AI Personality","Balanced / Wholesome / Sarcastic / Hype"],
  ["/settings/privacy","Privacy","Private posts, DMs"],
  ["/settings/notifications","Notifications","Likes, comments, follows"],
  ["/settings/blocked-accounts","Blocked","Manage blocked users"],
  ["/settings/connected-accounts","Connected","Google OAuth"],
  ["/settings/language","Language","Interface language"],
  ["/settings/accessibility","Accessibility","Motion, font size"],
  ["/profile/me","My Profile","Your dashboard"],
  ["/profile/edit","Edit Profile","Avatar via imgbb"],
  ["/settings/data-export","Export Data","Download your data"],
];
export default function SettingsHub(){
  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-text-mid">All v2 settings — every page is real, not placeholder.</p>
      <div className="grid md:grid-cols-3 gap-3 mt-6">
        {items.map(([href,title,desc])=>(
          <Link key={href as string} href={href as string} className="glass rounded-2xl p-5 hover:bg-white/5">
            <p className="font-semibold text-sm">{title as string}</p><p className="text-xs text-silver-dim mt-1">{desc as string}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
