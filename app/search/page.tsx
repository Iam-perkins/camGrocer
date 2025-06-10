import { SearchResults } from '@/components/search/search-results';
import { useSearch } from '@/contexts/search-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const category = searchParams?.get('category') || '';
  const minPrice = searchParams?.get('minPrice') || '';
  const maxPrice = searchParams?.get('maxPrice') || '';
  const organic = searchParams?.get('organic') === 'true';
  const onSale = searchParams?.get('onSale') === 'true';

  const [localQuery, setLocalQuery] = useState(query);

  const { search } = useSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.length >= 3) {
      search(localQuery);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>
        <div className="flex gap-2">
          <Select
            value={category}
            onValueChange={(value) => {
              window.location.href = 
                `/search?q=${query}&category=${value}&minPrice=${minPrice}&maxPrice=${maxPrice}&organic=${organic}&onSale=${onSale}`;
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Grains">Grains</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Meat">Meat</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
              <SelectItem value="Household">Household</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => {
                window.location.href = 
                  `/search?q=${query}&category=${category}&minPrice=${e.target.value}&maxPrice=${maxPrice}&organic=${organic}&onSale=${onSale}`;
              }}
              placeholder="Min Price"
            />
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                window.location.href = 
                  `/search?q=${query}&category=${category}&minPrice=${minPrice}&maxPrice=${e.target.value}&organic=${organic}&onSale=${onSale}`;
              }}
              placeholder="Max Price"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = 
                  `/search?q=${query}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&organic=${!organic}&onSale=${onSale}`;
              }}
            >
              Organic
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = 
                  `/search?q=${query}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&organic=${organic}&onSale=${!onSale}`;
              }}
            >
              On Sale
            </Button>
          </div>
        </div>
      </div>
      <SearchResults className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
    </div>
  );
}
