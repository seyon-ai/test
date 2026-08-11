/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { remotePatterns: [{ hostname: "gen.pollinations.ai" }, { hostname: "i.ibb.co" }] },
};
export default nextConfig;
