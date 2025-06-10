import { useSearch } from '@/contexts/search-context';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/image-with-fallback';
import { Star } from 'lucide-react';
import { useTranslation } from '@/lib/use-translation';
import { productTranslations } from '@/lib/product-translations';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: Array<any>;
}

interface SearchResultsProps {
  className?: string;
}

export function SearchResults({ className }: SearchResultsProps) {
  const { results, loading, error } = useSearch();
  const { t, language } = useTranslation();

  const getProductTranslation = (key: keyof ProductTranslation): string => {
    const productKey = key;
    return productTranslations[language as LanguageCode]?.[productKey] || key;
  };

  if (loading) {
  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t('try_again')}
        </Button>
      </div>
    );
  }

    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-2 bg-gray-200 rounded w-48" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-gray-500">{t('no_results_found')}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {results.map((product) => (
        <Card key={product.id} className="flex flex-col h-full">
          <CardHeader className="flex-none">
            <div className="aspect-square relative">
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.name}
                className="object-cover rounded-t-lg"
                fill
            />
            </div>
            <CardTitle className="mt-4 text-center line-clamp-2">
              {product.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600 line-clamp-3">
              {product.description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <p className="font-bold text-lg">
                {product.price} XAF
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex-none">
            <div className="flex justify-between w-full gap-2">
              <Button variant="outline" className="flex-1">
              {t('view_details')}
            </Button>
              <Button className="flex-1">
              {t('add_to_cart')}
            </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
