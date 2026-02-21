import type { NextConfig } from 'next';

const repoName = 'ComicMemo';
const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubPages ? `/${repoName}` : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default nextConfig;
