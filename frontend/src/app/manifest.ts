import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Kido Farms', short_name: 'Kido Farms', description: 'Farm-fresh produce from verified growers.', start_url: '/', display: 'standalone', background_color: '#06120e', theme_color: '#06120e', icons: [{ src: '/logo.svg', sizes: 'any', type: 'image/svg+xml' }] };
}
