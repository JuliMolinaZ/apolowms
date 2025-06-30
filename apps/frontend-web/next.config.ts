import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Indica que queremos export estático
  output: 'export',

  // Deshabilitar el indicador dev (el spinner / círculo con la “N”)
  devIndicators: {
    buildActivity: false,
  },

  // Configuración de imágenes
  images: {
    unoptimized: true,
  },

  // Habilitar soporte para styled-components
  compiler: {
    styledComponents: true,
  },

  // Alias para MUI styled-engine si usas styled-components
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/styled-engine': '@mui/styled-engine-sc',
    };
    return config;
  },

  // Reescrituras de rutas para apuntar a tu API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
