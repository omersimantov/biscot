// @ts-check
/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  images: {
    domains: [process.env.BASE_URL || "http://localhost:3000/"],
    // TODO: Configure
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      //   port: "",
      //   pathname: "/account123/**"
      // }
    ]
  },
  async redirects() {
    return [
      {
        // Attempt to mitigate DDoS attacks
        source: "/api/auth/:path*",
        has: [
          {
            type: "query",
            key: "callbackUrl",
            // prettier-ignore
            // eslint-disable-next-line no-useless-escape
            value: "^(?!https?:\/\/).*$"
          }
        ],
        destination: "/404",
        permanent: false
      }
    ];
  }
});
