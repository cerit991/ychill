"use client";

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Bell, Heart, Rocket, Briefcase, Code, Database, X } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

type TagProps = {
  text: string;
  color: string;
  onClick?: () => void;
  removable?: boolean;
};

type CategoryCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

type PolicyCardProps = {
  title: string;
  description: string;
  tags: string[];
  onClick: () => void;
};

type PolicyItem = {
  id: number;
  title: string;
  body: string;
  tags: string[];
};

const Tag: React.FC<TagProps> = ({ text, color, onClick, removable = false }) => (
  <span 
    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${color} mr-2 mb-2 ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    {text}
    {removable && <X className="ml-1 h-3 w-3" />}
  </span>
);

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, description }) => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <Button variant="link" className="mt-4 p-0 h-auto font-semibold text-blue-600">
        Browse Category
      </Button>
    </CardContent>
  </Card>
);

const PolicyCard: React.FC<PolicyCardProps> = ({ title, description, tags, onClick }) => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm cursor-pointer transition-shadow hover:shadow-md" onClick={onClick}>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg mb-2 text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap items-center mt-4">
        {tags.map((tag, index) => (
          <Tag key={index} text={tag} color={
            tag === 'Policy' ? 'bg-blue-100 text-blue-800' :
            tag === 'Economic' ? 'bg-green-100 text-green-800' :
            tag === 'Democratic' ? 'bg-purple-100 text-purple-800' :
            tag === 'Republican' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          } />
        ))}
      </div>
    </CardContent>
  </Card>
);

const PolicyCardSkeleton = () => (
  <Card className="overflow-hidden border border-gray-200 shadow-sm">
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <div className="flex flex-wrap items-center mt-4">
        <Skeleton className="h-6 w-16 mr-2" />
        <Skeleton className="h-6 w-16 mr-2" />
        <Skeleton className="h-6 w-16" />
      </div>
    </CardContent>
  </Card>
);

export default function ExplorePage() {
  const [selectedItem, setSelectedItem] = useState<PolicyItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleItems, setVisibleItems] = useState<number>(9);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [policyItems, setPolicyItems] = useState<PolicyItem[]>([]);

  const categories: string[] = ['All', 'Democratic', 'Republican', 'Economic', 'Foreign Policy', 'Healthcare'];

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const formattedData: PolicyItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          body: item.body,
          tags: generateRandomTags(),
        }));
        setPolicyItems(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching policy data:', error);
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const generateRandomTags = () => {
    const allTags = ['Democratic', 'Republican', 'Economic', 'Foreign Policy', 'Healthcare', 'Technology', 'Education', 'Environment'];
    const numTags = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  const filteredPolicyItems = useMemo<PolicyItem[]>(() => {
    return policyItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.tags.includes(activeCategory);
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.body.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      return matchesCategory && matchesSearch && matchesTags;
    });
  }, [policyItems, activeCategory, searchQuery, selectedTags]);

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + 9);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const allTags: string[] = Array.from(new Set(policyItems.flatMap(item => item.tags)));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        {/* ... (keep the existing nav content) ... */}
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Top Categories</h2>
            <Button variant="link" className="text-blue-600 font-semibold">
              View All Categories
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CategoryCard 
              icon={<Briefcase className="h-8 w-8 text-blue-500" />}
              title="Economic"
              description="Policies related to finance, taxes, and economic growth."
            />
            <CategoryCard 
              icon={<Heart className="h-8 w-8 text-red-500" />}
              title="Healthcare"
              description="Proposals for improving healthcare access and quality."
            />
            <CategoryCard 
              icon={<Rocket className="h-8 w-8 text-purple-500" />}
              title="Technology"
              description="Initiatives for advancing technological innovation."
            />
            <CategoryCard 
              icon={<Database className="h-8 w-8 text-green-500" />}
              title="Environment"
              description="Policies aimed at environmental protection and sustainability."
            />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Policies</h2>
            <Button variant="link" className="text-blue-600 font-semibold">
              View All Policies
            </Button>
          </div>
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <Button 
                key={index} 
                variant={activeCategory === category ? "default" : "outline"} 
                className={`border-blue-500 ${activeCategory === category ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-50'}`}
                onClick={() => setActiveCategory(category)}
                disabled={isLoading}
              >
                {category}
              </Button>
            ))}
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Filter by Tags:</h3>
            <div className="flex flex-wrap">
              {allTags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  color={selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}
                  onClick={() => handleTagClick(tag)}
                  removable={selectedTags.includes(tag)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(9).fill(0).map((_, index) => (
                <PolicyCardSkeleton key={index} />
              ))
            ) : (
              filteredPolicyItems.slice(0, visibleItems).map((item) => (
                <PolicyCard
                  key={item.id}
                  title={item.title}
                  description={item.body}
                  tags={item.tags}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            )}
          </div>
          {!isLoading && filteredPolicyItems.length > visibleItems && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} className="bg-blue-500 hover:bg-blue-600 text-white">
                Load More
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>{selectedItem?.body}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700">Detailed policy information would go here.</p>
            <div className="flex flex-wrap items-center mt-4">
              {selectedItem?.tags.map((tag, index) => (
                <Tag key={index} text={tag} color={
                  tag === 'Policy' ? 'bg-blue-100 text-blue-800' :
                  tag === 'Economic' ? 'bg-green-100 text-green-800' :
                  tag === 'Democratic' ? 'bg-purple-100 text-purple-800' :
                  tag === 'Republican' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                } />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}