
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Lightbulb, Users, ThumbsUp, Send, Award, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  participants: number;
  endsIn: string;
}

const initialPosts: Post[] = [
  { id: '1', author: 'EcoWarriorJane', avatarUrl: 'https://avatar.vercel.sh/jane.png', content: 'Just turned my old jeans into a cool tote bag! So happy with how it turned out. #DIYReuse', timestamp: '2h ago', likes: 15, comments: 3 },
  { id: '2', author: 'GreenThumbMike', avatarUrl: 'https://avatar.vercel.sh/mike.png', content: 'Any tips for composting in a small apartment? Trying to reduce my food waste.', timestamp: '5h ago', likes: 8, comments: 5 },
  { id: '3', author: 'RecycleRita', avatarUrl: 'https://avatar.vercel.sh/rita.png', content: 'Found a new drop-off point for e-waste in the North District! Check EcoMap for details.', timestamp: '1d ago', likes: 22, comments: 2 },
];

const initialChallenges: Challenge[] = [
  { id: 'c1', title: 'Plastic-Free Week', description: 'Try to go an entire week without using single-use plastics. Share your journey!', points: 100, participants: 45, endsIn: '3 days' },
  { id: 'c2', title: 'Upcycle Challenge: Old T-shirts', description: 'Transform an old t-shirt into something new and useful. Post a picture of your creation.', points: 50, participants: 78, endsIn: '5 days' },
  { id: 'c3', title: 'Community Cleanup Drive', description: 'Organize or join a local cleanup event. Make a difference in your neighborhood.', points: 200, participants: 23, endsIn: '10 days' },
];


export default function CommunityPage() {
  const { toast } = useToast();
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [isPosting, setIsPosting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      toast({ title: "Empty Post", description: "Please write something to share.", variant: "destructive" });
      return;
    }
    setIsPosting(true);
    // Simulate API call
    setTimeout(() => {
      const newPost: Post = {
        id: crypto.randomUUID(),
        author: 'CurrentUser', // Replace with actual user
        avatarUrl: 'https://avatar.vercel.sh/current.png',
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
      };
      setPosts([newPost, ...posts]);
      setNewPostContent('');
      toast({ title: "Post Shared!", description: "Your thoughts are now live in the community." });
      setIsPosting(false);
    }, 1000);
  };

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><MessageCircle className="mr-3 h-7 w-7" />Community Zone</CardTitle>
          <CardDescription>Connect with fellow eco-enthusiasts, share ideas, participate in challenges, and inspire each other!</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
          <TabsTrigger value="feed" className="text-base"><Lightbulb className="mr-2 h-5 w-5" /> Feed</TabsTrigger>
          <TabsTrigger value="challenges" className="text-base"><Award className="mr-2 h-5 w-5" /> Challenges</TabsTrigger>
          <TabsTrigger value="groups" className="text-base md:hidden lg:inline-block"><Users className="mr-2 h-5 w-5" /> Groups (Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <Card className="shadow-md mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Share Your Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePostSubmit} className="space-y-3">
                <Textarea 
                  placeholder="What's on your eco-mind? Share tips, successes, or ask questions..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={3}
                />
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isPosting}>
                  {isPosting ? 'Posting...' : <><Send className="mr-2 h-4 w-4" /> Post to Community</>}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="mb-6">
            <Input 
              placeholder="Search feed..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              icon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <Card key={post.id} className="shadow-sm">
                  <CardHeader className="flex flex-row items-start space-x-3 pb-2">
                    <Avatar>
                      <AvatarImage src={post.avatarUrl} alt={post.author} />
                      <AvatarFallback>{post.author.substring(0,1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{post.author}</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                  <CardFooter className="flex justify-start gap-4 border-t pt-3">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <ThumbsUp className="mr-1 h-4 w-4" /> {post.likes} Likes
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                      <MessageCircle className="mr-1 h-4 w-4" /> {post.comments} Comments
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Posts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term or broaden your search." : "No posts in the feed yet. Be the first to share something!"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges">
           <div className="mb-4">
            <Input placeholder="Search challenges..." className="max-w-sm" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-primary">{challenge.title}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    <Award className="inline h-3 w-3 mr-1 text-yellow-500" /> {challenge.points} Eco Dharma Points | Ends in {challenge.endsIn}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-3">{challenge.description}</p>
                  <p className="text-xs text-muted-foreground">{challenge.participants} participants</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Join Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="groups">
          <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Community Groups Coming Soon!</h3>
              <p className="text-muted-foreground">Connect with like-minded individuals in focused groups.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
