
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Ticket, Heart, Leaf } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RewardItem {
  id: string;
  type: 'coupon' | 'donation';
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  partner?: string;
  dataAiHint?: string;
}

const availableRewards: RewardItem[] = [
  { id: 'c1', type: 'coupon', title: '10% Off at GreenMart', description: 'Get 10% off your next purchase of eco-friendly products at GreenMart.', pointsRequired: 500, imageUrl: 'data:image/jpeg;base64,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', partner: 'GreenMart', dataAiHint: 'grocery store' },
  { id: 'c2', type: 'coupon', title: '$5 Voucher for EcoThreads', description: 'Enjoy a $5 voucher for sustainable fashion at EcoThreads.', pointsRequired: 750, imageUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCADqANYDASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAEEBgIDBQf/xABHEAABAwMBBQUEBAoHCQAAAAABAAIDBAURIQYSMUFRExQicZEyUmGBB3KhshUWIzM1QmJzhLNTkrHB0eHwJDQ2Q3WCg9Lx/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAEDBAUGAv/EAC8RAQACAgAEBAUDBAMAAAAAAAABAgMRBBIhMQUTFFEyQWFxsSJygQYk0fA0ocH/2gAMAwEAAhEDEQA/APrQVREBERAUwVUQEREBTKFAEAKoiAiIgFQA/FVEBERAUJQlAEABVEQEREEKAKogIiICIoSgEqAFUBVAREQEUJQIKiIgIihKAT0Qc0A6qoCIiAimeSqAiIgIihKBlUKAc1UBERARTKIBKgC5YRAREQFCoSOCoCCALkiICIiCEoAmFUBERAUJQnkgCAAqiICIoUEJ5BUIAqgIiIChPRCUAQAPNFUQEREBERBMKoiAiKEoLoi4EhrS5xAa0Fzi4gAAakklavtNc3dzphbq1hY6ocypfSTtLwNwlrS6M5AOvp615MkY6zaWTw3DW4nJGOvz+baJZYoY5JZpGRxxtLnvkcGtaOpJXVSVtFWxukpZ4pmNduuMbs7p44cDqF81mu1xqKHuE8zpYhOyZr5CXSANBAYXHUjmM9PThQ3Kst3ezSv3H1MLYS7juYdvbzQdM8QPNYXrq80dOjfx/T1/LmZt+rfT21+X1VQ81omzVzre/wAwq615pDTySTuq58sY8OaGODpXaE5I/wDi3eGaCdnaQSxyxnQPie17c9MtOFl4ssZa80NLxvBX4PJ5dp39XYAqiK5giIoSgqKDKqAiIgKHKqYQQBVEQEREBQlCf9ZQBAAVREBEWLJPI17mjGAfmqsuWuKN2eq1m06hkkoAsQTy/s+iveJejfRY/rsX+ws8mzGv8HebVWwiaOEuEZa6aRscbixwfuPc7TBxhfMiMEggZBIOCD9o0X0K52ymuz4HVUlQBC0hjIZA2PJOS4tIOvJYH4rWj+lrR/5mf+i13E565bbq6bwri8XB4Zrkmdz11rt/LRJKgAgMwRqCSCNeGikdQ7w7+N0Z3ieJ9F6N1tlLRV9XTxumfHEY8OkeHPJdG15JIA69FhGniJaMvwXMbo7XUgdFT0dLS85axevaerty12CPZOo+a3fY2mdFT107poial8RbBHKx7o2sDhvyhp0c7PDoB8uobKWho3e1rjjQEzMz67iyaOw0FBUw1dPLViWInAdK0teCCC14DRkL3gy1x3i0tD4hx+DiuHnFSZiZ+jZkWJ3iX9n0U7xLr7Potp67F/sOS8mzLJTCxO3l/Z9FljkrsWemXfL8ni1Jr3VERXvAplQlUBBQiIgIihKASigCIKAqiICIplBVhSgdpJ5/3LNWJOxze1lPsDxE51x5LA46s2pGoXYZiLOpF094h6n0Kd4h6u9CtDz192fyW9ncp/muo1EPV3oU7xD1d/VKeZX3OS3s0naHP4Xrx+44c/yLF5Q9qP8AeR/eC9O/Oa67VzmkkHsMZ0P5lgXmj2o/rx/eCt3uNu74SNcNSPpH4fUDxPmi6jUQZOruPQqd5g6u/qlVc9fdwfJb2dymF194h6u9Cp3iHqfQpz1908lvZ3L0BwHkvPizO0uj1AO6c6a8eaz9ANeGOa3Hh8TEWt8p1/6w889dKuJKbzDoHNPkQSrhbSJiezGAFURSCIiCFAFUQEREDCYRQlAJQBAFUDC652h0UrXDQtIOCuxcJfzcn1VXl+C32eq94eZ3eHofUp3eDofUrtQLluSvs2fPb3dXd4fdPqU7vD7p9Su5E5K+yOe3u0G/tDLtXNbwHYY58YWFeYPaZ9eP7wXq7Q/pev8A4f8AkMXltGXM5DfjOf8AuCuiOmnecLP9tT9sfh9KNPDk+E8epQU8PMH1K7sanzRVTSvs4Pnt7uru8HQ+pUNPAMkjAAJJLiAAF3LBq5S54gZwBG/jm7iAfL/XBU5ZpirzTCynPedRK98dG10VICA5xJedXE4x4QeC6THPId6V5JPvEuK7GMDBganmeq5LUZeJy5I1aekfL5MmOWk/oj+XR3cjg4ehXZHUV1NjDy5g/VeS5uOmuoXYnyVePNkxTzUnUpmYvGrRuHp0tXFUtOPDI0eJhOo+IPRZK1w78D2SxnGDkfD4H4Fe7DM2eFkreDhqOh4ELtPC/EPVV5L/ABR/21PFcPGP9VO0u0nogCAKrcsMwmERAwihIHREA5TGdVUQEREBdcp/JyfVK5krhIPycn1Sq8nwT9k17wwsKoi5lsRERBoe0AJvFfppiD+SxeXnxMA/pI/vBeptB+l6/wDh/wCQxeUPaj/eR/eCs+TveEj+3p+2Pw+onifNEPE+ZRVuCQkAEngBk/JeXF43vkOp1PzcvSfkskA91w+xedT/AK48itZx86irKwfDaXeASRxJPDmSuXZyHA3H6kD2Xc9OimoII0I4ELPpZ5ZCY367rc7/AD44wVRwWDFxGSMd7TEz26bect7UjdYddXEW9iWNJG5uHAJ9nhwWKWvGpa4DhqCP7V7Ejixj3Bud1pdgHGcLypZpJjl50HBo9keS2Xi/C4cN+eJ6z2jX8d1HDZL2jXyh0PG81w+Bx5jVZVpky2oj5NLXt8naH+xY54HPTK7bSD2lSeQZGPmSSsTwq014ukV+v4ZGeN4Lb+j2EQIu9aQXElUlAEABFUQEREBFMqoC4S/m5Pqlc1wl/NyfVXjJ8E/ZNe8MJEUXMNiZ+CqmFUGh7Q/peu/h/wCQxeUPaj/eR/eC9XaH9L1/8P8AyGLyh7Uf7yP7wXt33Cf8an7Y/D6ieJ806pzPmUXhwIvMcOwncD7JOh/ZOoK9NdFRAJm6YD2+yf7isXisM5adO8LsN4rOp7S6l2xzmGN4YPG86uPIAaYCwmyOjJjkB8OnxC7g5rhoQVp8WS+G3NTpK++PcansyIqiSNxyd5rjlwceOeJyuo7uXboOMnGei4/P1XW+Vjc4OT8OA80vmvekUtO4jsiuON7rBM/dYRzdp5DmvTtkJjp99w8Uzt/B5Nxhv+PzWBR0j6t4llB7Aa6/8z9lvw6r3AABjoui8E4K0T6i8fb/ACxeMyxEeVX+VUKqLqmrQBVEQERED0UJTKAIACvoiIHouLwXNc0YyRhclDlRMc0akYpp5Peb9qd2k95v2rJA5lclh+ixLfOsxe7ye837U7u/3m/aspE9FiPNs0+6bMXOurqqqino2Ry9nutkMu8NyNrNd1uOSwhsddwWk1VDgOaTgzZ0cD7q3slUBT6PF7NnTxni8dIpWY1HTsxu7yanebxzzTu8nvN+1ZSZ4qPRYms82zF7u/3m/and5Peb9qylCU9FiPNsxXUkMjN2VoccndcNHN8isN9odr2Uwx0kbr6t/wAF6oC5Lzk8O4fLGrV/y904nLT4ZeMLTUn2pogPgHH7NFkw2umjIdITK4cnYDM/VH+K9BFXi8K4XHO4rv79Xq/F5rxqZQAAY0AHDHJCeih1VAWzYoFfREQPREXEnp8UFJRQAoguM6q+iIgL5w3ajb6vvF+t1norVUC2VVSwtmaY3diyofCzxPmaCTjXgvo/+S+N0R2obtDt7Ls/LFHPBUVs1UHsZJLLC2smLWQNkY5pdxPL58F7rHd5tLetk9qZ78650dfSNpLlbXMFRHHvdm5rnPj0a/LgWlpDhk8tdcD1qvaHZuhn7rWXWggqAQHRSTsD2E64eOXzwtP2FZRRWS/3umqZKq81Dal1cZgN6OWFsk8bGtySQ4u3t7nnlu4GsbNUlxrrfdJYdlaS9vq6iWOor6ythjqI5DG1+7GJfGCC7f3hgku46aTyxuUbl9eqLtZqQUTqmvo4m1uO5ukmYG1GS0DsjnB9pvDqpW3azW58MVfX0lNJPkwsqJWMfIN4My1pOeJAXy6u2fv1JsNIy5QOgqrPd3VVGDLFK5lHUNYx26YnEAb7t7HwXC8dttZPtDWgEiz7JWyeIszhtTNuVknzA7UfL4KOWDmfV6u52qhkpYayspoJat/Z00c0jWvmfvNZiNp1OpA+ax66/bP26Qw1tzooJRjeikmb2jcgEFzG5I+YWg0VQ/ajbPZWV+HQ2qxUVxnxwFQYWya/Hfkb/UWTUVtDfb9d47RsfQXWqpd2nrq+5zxxRlsRdACGuY4cnBpGpDeAwnKnbfqaut9XT97pqqnnpd1zu2hka+MBoy7LmnAxzWLJtDs3FS01a+60IpamR8VPL2zS2Z7HbjhHjU4OhwNFoX0fl7abb+AgMZGGOETXl8cbzFUsduu5+yBnnuhdP0f7NWS70NTcLnC+qfTVraWkifLK2GBrI4qguayNwGXOdk56fHVNdb2iLTL6PX3uw2ySKK4XGjppZBvMZPK1ry3JG8W8QOOp00+C1bZ+83et2z2ot89a+W301PNJRw7sXZsHbxBjmuY0OOh01PFeNZbfb77tttkbxAyr7pJUd3gqMvZ4ak0zXFnPca1oHTeXfshSUtBtztbSUg3aWnpJ4oWhxcI2iphPZgnXDckDXkp1ERJtvl5q5qC03etgEZmpKGqqYhIC5hfHGXDeAIOPmvn9Ntb9Is1skvjLZaZrXCZhK9oe2QCJ/ZvcWdvv4B4nB64wt42m/wCHtpP+k1/8ly+a2Gi29umzottqNthstTNWRPmnkLJ3b0zu2a/dDnbpORoBkc9UrEa2TPV9Lsl8pLxZ6a74bTRPZKahs0jd2nfA5zJA6Q4GAQTnTRcqTaHZuun7rSXWhmqDkNjjmYXvI9wHj8sr5/tjb5dndj7FZYJ3vidWSurZ8bomm3ZKgktGm7vEkDX2B0XLbiwbPWbZ+2Vtrp46aqhqqdkVTCSJZgYZJe0e8HJcC0ODuOnxUcsG5bVtFU3eG57NMo77a7dTyVAFXTVpaJ61pmjZuwtLHE6EtxvN1cDnp7k1ytcFT3OatpYqru76swyzMZIKdmS6Uhx0aMHJ+C+dbVzTVFx+i2eYYmn/AAfNMMY/KSVFG52nmVz2qo6e47fbOW+pBdS1VNStqIwS0SxsNVMWOLcHB3QDqnKczfKC92C5SyQ0Fyo6maMFzo4ZWufujQuDeJHxH968u4bYWq33yhs0joNySOV9dWPqWMionNa9zI5Bg+J2MY3hjeHVapdbfb7Pt9sbHbKeOkjnFO+SOnG4wueaiF2GjQZAAKlfarTJ9I9uoX0NM6jqoH1FTAY29lLM+mqZXSPbwJJAJPUKYrBuX0OS82OKihuMtxo2UM/5iofMwRS8dIyTqdDw6JQXqx3Qubb7hR1L2NLnMgla6RrcgbxZ7WPjhajthspXVUNhlsVJSyQ2cStFskDWwvY6RkvgY8hhB3cOaSMg8eRbGXKyT3O4Uv4vw2a+tpQKpkEZjjlhikG8BGQC0guBIxqCDk40866bTvq330Uwqi8vR6IiICIoSgE8Fr9n2ZhtF0vl0ZWTTSXV73vjkZG1kW9O+fDSzU+0RqtgAVU7Gt2/ZWC1Xyvu9BWzRQV+/wB5t4jiNM7ey7wn2hhxLh0yRwOF50mwTIKqpnsl+ulnjqXb01PSOBizknDNWuwMnAJOOWmi3VE3KNQ8Sm2fggsdVZJaurq2VUVYyeqq3NkqHvqi5zn5xjIJy3yWJYNkqGxUd3pG1M1V+E8NqJJ2Rsd2YiMIYAzTGrj81spKAJuTUNZ2Y2Qo9mZK+WOrnqpauOni352RsMccJc7daI+pOT5BYU2wcX4Sr62gvl1t8Fwe99ZTUTmM3w9xe9jZRqASTjIOM6LdETmk1DW7PsnQWT8YG0dRN2N3axjYnhhFKxjJGBsbj4jje59PXI2Z2eh2aoZ6GKrlqWzVTqovmZGxwLo44t0CPTHh+1e4oT0TcyahqF12Ip666vvFDdbhaqub/eXUG6DISAxzmOyHNLgPFqQeOM8cqy7I2+x3StuVJU1L21NI2l7CoLZN3xskdIZj4y5xBJz7x+WygZVTc9jUMS5UTbjb7hQOldE2spZqZ0jAHOYJWlhcA7TKxNn7LFYLbFbYqiSdkctRL2krWNcTNIZCMM05r1kTfyS868Wi33yhloK5rjC8te18ZDZIpW+zJG4gjI15cyDkFarB9HdIZaP8J3q53Gioz/s1DUFrYGtBHgOp8OgyGhucdNFvRKBImYRqJa/etmKe9V9ir5KuaA2iVkscUUcTmS7s0c2HF2o9kDRWs2ZgrNo7ZtE6rmbLQRNiZTNZGYn7rZm5c8+L9c+i2BE3JqGvXLZmC436y319ZNHJa2xNZAxkZjk7N8j8uc7xfrY+Sx9oNj4b1XUl0guVZbrhTxtiE9KGu3msLi0jJDg4ZIyHcDhbSoSm5NNTqNkaqSns8dPtJeqaqt0E0DqtkgdJVCWXtnGbUEnPDxcFkWHZSms1XV3Kauq7jc6phikqqwtBbGXBxDWtzqcDJJPsgaDjsgCqbk1AiIoSIpnoUQVTCqICIiAoShygHMoACqIgIiIIcqAdVy9EQEREBcSVSgCAB1VREBERBCVAFcBVAREQFDr9qhPRUIIAi5IgZTKIgZTKmfNUICZREDKIoSgEqgqAKoGUyiIGUymUQNEREDKZRQlAyrlcQFyQMplEQMplNEQTCqIgZREQFCVUwEEAVREBERBCUATAVQEREBQkqpgIIBzVREBERBCUwrgdAiAiIgKE+aqYHRBAFURAREQQlFcDoiD/2Q==', partner: 'EcoThreads', dataAiHint: 'clothing store' },
  { id: 'd1', type: 'donation', title: 'Plant a Tree with TreesForAll', description: 'Use your points to have a tree planted in a reforested area.', pointsRequired: 300, imageUrl: 'https://placehold.co/300x200.png', partner: 'TreesForAll', dataAiHint: 'forest trees' },
  { id: 'd2', type: 'donation', title: 'Support CleanWater Project', description: 'Contribute to providing clean drinking water to a community in need.', pointsRequired: 1000, imageUrl: 'https://placehold.co/300x200.png', partner: 'CleanWater Org', dataAiHint: 'water well' },
  { id: 'c3', type: 'coupon', title: 'Free Coffee at The Organic Bean', description: 'Redeem for a free organic coffee or tea.', pointsRequired: 200, imageUrl: 'https://placehold.co/300x200.png', partner: 'The Organic Bean', dataAiHint: 'coffee cup' },
];

export default function RewardsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ecoDharmaPoints, setEcoDharmaPoints] = useState(1250); // Mock user points

  const handleRedeem = (reward: RewardItem) => {
    if (ecoDharmaPoints >= reward.pointsRequired) {
      setEcoDharmaPoints(prevPoints => prevPoints - reward.pointsRequired);
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed "${reward.title}". Details will be sent to your email.`,
      });
      // In a real app, update backend, send email, etc.
    } else {
      toast({
        title: "Not Enough Points",
        description: `You need ${reward.pointsRequired - ecoDharmaPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center"><Gift className="mr-3 h-7 w-7" />Eco Dharma Rewards</CardTitle>
          <CardDescription>Use your hard-earned Eco Dharma points to redeem exciting coupons or make meaningful donations.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between items-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
          <div className="text-center md:text-left">
            <p className="text-lg text-muted-foreground">Your Current Balance</p>
            <div className="flex items-center justify-center md:justify-start">
              <Leaf className="h-10 w-10 text-green-500 mr-2" />
              <span className="text-5xl font-bold text-primary">{ecoDharmaPoints}</span>
              <span className="ml-2 text-lg text-muted-foreground">Points</span>
            </div>
          </div>
          <Button size="lg" className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground">
            How to Earn More Points?
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="coupons" className="text-base"><Ticket className="mr-2 h-5 w-5" /> Coupons & Vouchers</TabsTrigger>
          <TabsTrigger value="donations" className="text-base"><Heart className="mr-2 h-5 w-5" /> Make a Donation</TabsTrigger>
        </TabsList>

        <TabsContent value="coupons">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.filter(r => r.type === 'coupon').map(reward => (
              <Card key={reward.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48 w-full">
                  <Image src={reward.imageUrl} alt={reward.title} layout="fill" objectFit="cover" data-ai-hint={reward.dataAiHint || 'coupon item'} />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-primary">{reward.title}</CardTitle>
                  {reward.partner && <CardDescription className="text-xs text-muted-foreground">Partner: {reward.partner}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground mb-2">{reward.description}</p>
                </CardContent>
                <CardFooter className="flex-col items-start space-y-2 border-t pt-3">
                    <p className="text-base font-semibold text-accent flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-green-500" /> {reward.pointsRequired} Points
                    </p>
                    <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                        onClick={() => handleRedeem(reward)}
                        disabled={ecoDharmaPoints < reward.pointsRequired}
                    >
                        Redeem Coupon
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableRewards.filter(r => r.type === 'donation').map(reward => (
              <Card key={reward.id} className="shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-48 w-full">
                  <Image src={reward.imageUrl} alt={reward.title} layout="fill" objectFit="cover" data-ai-hint={reward.dataAiHint || 'donation cause'} />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-primary">{reward.title}</CardTitle>
                  {reward.partner && <CardDescription className="text-xs text-muted-foreground">To: {reward.partner}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-foreground mb-2">{reward.description}</p>
                </CardContent>
                <CardFooter className="flex-col items-start space-y-2 border-t pt-3">
                     <p className="text-base font-semibold text-accent flex items-center">
                        <Leaf className="h-4 w-4 mr-1 text-green-500" /> {reward.pointsRequired} Points
                    </p>
                    <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                        onClick={() => handleRedeem(reward)}
                        disabled={ecoDharmaPoints < reward.pointsRequired}
                    >
                        Donate Points
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
