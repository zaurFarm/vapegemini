import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VapeAI',
    url: 'https://vapeai.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vapeai.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ProductGrid />
      <Benefits />
    </>
  );
}
