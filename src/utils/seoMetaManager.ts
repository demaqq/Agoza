/**
 * seoMetaManager — SEO metadata helpers.
 * Provides page title, description, and canonical URL updates for search engines.
 */

export interface MetaSnapshot {
  title: string;
  description: string;
  canonical: string;
  canonicalUrl: string;
  isItemSpecific: boolean;
  ogImage: string;
  ogType: string;
  schemaJson: string;
}

export function updatePageMeta(
  selectedCollectible: any,
  formatPrice: (price: number) => string
): MetaSnapshot {
  const title = selectedCollectible?.title || 'Agoza Marketplace';
  const description = selectedCollectible?.description || 'Buy and sell on Agoza';
  const canonicalUrl = selectedCollectible?.id
    ? `https://agoza.et/item/${selectedCollectible.id}`
    : 'https://anza.et';
  const priceText = selectedCollectible?.priceETB
    ? formatPrice(selectedCollectible.priceETB)
    : '';

  return {
    title,
    description,
    canonical: canonicalUrl,
    canonicalUrl,
    isItemSpecific: !!selectedCollectible,
    ogImage: selectedCollectible?.imageUrl || '',
    ogType: 'product',
    schemaJson: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description,
      image: selectedCollectible?.imageUrl || '',
      offers: {
        '@type': 'Offer',
        price: selectedCollectible?.priceETB || 0,
        priceCurrency: 'ETB',
      },
    }),
  };
}