/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "samuraistarter.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "samuraistarter.mypinata.cloud",
        port: "",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
        port: "",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // // Add this line to disable fs
    // if (!isServer) {
    //   config.resolve.fallback = { fs: false };
    // }

    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
