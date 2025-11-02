
"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Wrench, Truck, Search, ExternalLink, Send } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const diyTutorials = [
  { id: '1', title: 'Turn Plastic Bottles into Planters', description: 'A simple guide to creating beautiful planters from used plastic bottles.', difficulty: 'Easy', link: '#' },
  { id: '2', title: 'Upcycle Old T-shirts into Tote Bags', description: 'No-sew method to transform old t-shirts into reusable shopping bags.', difficulty: 'Easy', link: '#' },
  { id: '3', title: 'Create Organizers from Cardboard Boxes', description: 'Learn to make custom organizers for your desk or drawers using waste cardboard.', difficulty: 'Medium', link: '#' },
];

export default function TakeActionPage() {
  const { toast } = useToast();
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDetails, setPickupDetails] = useState('');
  const [isRequestingPickup, setIsRequestingPickup] = useState(false);

  const handlePickupRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim()) {
      toast({ title: "Pickup Request", description: "Please enter your address.", variant: "destructive" });
      return;
    }
    setIsRequestingPickup(true);
    // Simulate API call
    setTimeout(() => {
      toast({ title: "Pickup Requested!", description: `We'll contact you soon regarding your pickup at ${pickupAddress}.` });
      setPickupAddress('');
      setPickupDetails('');
      setIsRequestingPickup(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Wrench className="mr-3 h-7 w-7" />DIY Reuse & Upcycling</CardTitle>
          <CardDescription>Get creative and give your waste items a new life! Explore tutorials and templates.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {diyTutorials.map(tutorial => (
              <AccordionItem value={tutorial.id} key={tutorial.id}>
                <AccordionTrigger className="hover:text-accent font-medium text-base">{tutorial.title} <span className="text-xs text-muted-foreground ml-2">({tutorial.difficulty})</span></AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p className="text-sm text-foreground">{tutorial.description}</p>
                  <Button variant="link" asChild className="p-0 h-auto text-accent hover:underline">
                    <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                      View Tutorial <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><MapPin className="mr-3 h-7 w-7" />Donate or Drop-off</CardTitle>
          <CardDescription>Find nearby donation centers, drop-off points, and recycling facilities on our EcoMap.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-64 w-full md:h-80 rounded-lg overflow-hidden border border-input shadow-inner">
            <Image 
              src="https://staticmap.openstreetmap.de/staticmap.php?center=12.9716,77.5946&zoom=11&size=800x400&maptype=mapnik" 
              alt="Map overview of Bangalore with drop-off locations" 
              layout="fill" 
              objectFit="cover"
              data-ai-hint="city map bangalore" 
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button variant="secondary" size="lg" asChild>
                <a href="/dashboard/ecomap">
                  <Search className="mr-2 h-5 w-5" /> Explore EcoMap
                </a>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">The EcoMap shows locations for various recycling needs, community campaigns, and SHG centers in Bangalore.</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Truck className="mr-3 h-7 w-7" />Request Waste Pickup</CardTitle>
          <CardDescription>Schedule a pickup for your recyclable or bulk waste items. (Service availability varies by region)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePickupRequest} className="space-y-4">
            <div>
              <Label htmlFor="pickup-address">Full Address</Label>
              <Input 
                id="pickup-address" 
                type="text" 
                placeholder="Enter your street address, city, postal code" 
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="pickup-details">Waste Details (Optional)</Label>
              <Textarea 
                id="pickup-details" 
                placeholder="e.g., Approx. 5kg mixed recyclables, old electronics"
                value={pickupDetails}
                onChange={(e) => setPickupDetails(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isRequestingPickup}>
              {isRequestingPickup ? 'Requesting...' : <><Send className="mr-2 h-4 w-4" /> Submit Pickup Request</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

