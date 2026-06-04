/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
const isExport = process.env.STATIC_EXPORT === "true";
const repo = "istore"; // nombre del repo → base path en GitHub Pages

const base = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

let nextConfig;
if (isPages) {
  // GitHub Pages (sirve bajo /istore)
  nextConfig = {
    ...base,
    output: "export",
    basePath: `/${repo}`,
    assetPrefix: `/${repo}/`,
    trailingSlash: true,
    env: { NEXT_PUBLIC_BASE_PATH: `/${repo}` },
  };
} else if (isExport) {
  // Export estático genérico (Netlify Drop, Surge, raíz de cualquier host)
  nextConfig = {
    ...base,
    output: "export",
    trailingSlash: true,
  };
} else {
  // Vercel / local (con server)
  nextConfig = {
    ...base,
    async headers() {
      return [
        {
          source: "/sw.js",
          headers: [
            { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
            { key: "Service-Worker-Allowed", value: "/" },
          ],
        },
      ];
    },
  };
}

export default nextConfig;

