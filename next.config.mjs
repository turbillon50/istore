/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "istore"; // nombre del repo → base path en GitHub Pages

const base = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

const nextConfig = isPages
  ? {
      ...base,
      output: "export",
      basePath: `/${repo}`,
      assetPrefix: `/${repo}/`,
      trailingSlash: true,
      env: { NEXT_PUBLIC_BASE_PATH: `/${repo}` },
    }
  : {
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

export default nextConfig;
