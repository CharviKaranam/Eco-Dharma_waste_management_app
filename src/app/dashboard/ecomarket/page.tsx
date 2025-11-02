
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingBag, Search, Filter, Star, Tag, Info } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/lib/types';

const initialProducts: Product[] = [
  { id: '1', name: 'Upcycled Denim Tote Bag', description: 'Stylish and durable tote bag made from recycled denim jeans.', price: 25, imageUrl: 'https://images.unsplash.com/photo-1596214139169-91b7690799a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'GreenStitch Collective', category: 'Fashion', dataAiHint: 'denim bag' },
  { id: '2', name: 'Recycled Paper Journals', description: 'Set of 3 eco-friendly journals with covers made from recycled paper.', price: 15, imageUrl: 'https://images.unsplash.com/photo-1516414447565-79c7216451ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'PaperMakers United', category: 'Stationery', dataAiHint: 'notebook journal' },
  { id: '3', name: 'Glass Bottle Wind Chimes', description: 'Beautiful wind chimes crafted from colorful recycled glass bottles.', price: 30, imageUrl: 'https://images.unsplash.com/photo-1600979931492-08d9a8911a6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'SoundWeavers SHG', category: 'Home Decor', dataAiHint: 'wind chime' },
  { id: '4', name: 'Plastic Waste Coasters (Set of 4)', description: 'Unique coasters made from melted and molded plastic waste.', price: 12, imageUrl: 'https://images.unsplash.com/photo-1618720077834-3e65990e3f8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'ReForm Artisans', category: 'Kitchen', dataAiHint: 'drink coaster' },
  { id: '5', name: 'Tire Planter Pot', description: 'Rugged and creative planter pot made from a recycled tire.', price: 40, imageUrl: 'https://images.unsplash.com/photo-1593504927223-1013ea7a746a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'SecondLife Gardens', category: 'Garden', dataAiHint: 'tire planter' },
  { id: '6', name: 'Newspaper Woven Basket', description: 'Handwoven decorative basket made from rolled newspaper strips.', price: 20, imageUrl: 'https://images.unsplash.com/photo-1589801258580-54c056170078?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80', shgName: 'EcoWeave SHG', category: 'Home Decor', dataAiHint: 'woven basket' },
];

const categories = ['All', 'Fashion', 'Stationery', 'Home Decor', 'Kitchen', 'Garden'];

export default function EcoMarketPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    let filtered = initialProducts;
    if (searchTerm) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterCategory !== 'All') {
      filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    // Create a new array for sorting to avoid mutating the original filtered array reference directly if not needed
    const sortedProducts = [...filtered];
    if (sortOrder === 'price_asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price_desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  }, [searchTerm, filterCategory, sortOrder]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><ShoppingBag className="mr-3 h-7 w-7" />EcoMarket</CardTitle>
          <CardDescription>Discover unique recycled and upcycled products crafted by talented Self-Help Groups (SHGs). Support sustainability and local artisans.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="md:col-span-1"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger><SelectValue placeholder="Filter by category" /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col group">
                  <div className="relative h-56 w-full">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      width={400}
                      height={300}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={product.dataAiHint || 'recycled product'}
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-primary leading-tight hover:text-accent transition-colors">{product.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">By {product.shgName}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-foreground line-clamp-3">{product.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2 border-t mt-auto">
                    <p className="text-xl font-bold text-accent">${product.price.toFixed(2)}</p>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <div className="text-center py-16">
              <Info className="mx-auto h-16 w-16 text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Treasures Found... Yet!</h3>
              <p className="text-muted-foreground">It seems no products match your current search or filters. Try adjusting them, or check back soon for new artisan creations!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
