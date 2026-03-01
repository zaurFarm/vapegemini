import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailsClient product={product} />;
}
