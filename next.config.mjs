// @ts-check
/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */

export default {
  reactStrictMode: true,
  swcMinify: true,

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
};
