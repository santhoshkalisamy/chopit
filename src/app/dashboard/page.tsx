'use client';
import React, { useState, useEffect } from 'react';
import { SignOutButton } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUrlStats, Url } from "@/actions/URLShorteningAction";
import Link from "next/link";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserIcon, LinkIcon, ExternalLinkIcon, LogOutIcon } from 'lucide-react';

const DashboardPage = () => {
    const [urls, setUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        getUrlStats()
            .then(res => {
                setUrls(res.urls);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching URLs:', error);
                setLoading(false);
            });
    }, []);

    // Transform data for charts
    const clicksData = urls.map(url => ({
        name: url.urlCode,
        clicks: url.clicks,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur">
                    <CardHeader className="pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-slate-100">Dashboard</CardTitle>
                            <CardDescription className="text-slate-300">
                                Manage and track your shortened URLs
                            </CardDescription>
                        </div>
                        <SignOutButton redirectUrl="/">
                            <Button variant="outline" size="sm" className="gap-2 text-slate-200 border-slate-700 hover:bg-slate-700">
                                <LogOutIcon className="h-4 w-4" />
                                Sign Out
                            </Button>
                        </SignOutButton>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-400">Total URLs</p>
                                    <h3 className="text-3xl font-bold text-slate-100">{urls.length}</h3>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-full">
                                    <LinkIcon className="h-6 w-6 text-blue-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-400">Total Clicks</p>
                                    <h3 className="text-3xl font-bold text-slate-100">
                                        {urls.reduce((total, url) => total + url.clicks, 0)}
                                    </h3>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-full">
                                    <ExternalLinkIcon className="h-6 w-6 text-purple-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-400">Average Clicks</p>
                                    <h3 className="text-3xl font-bold text-slate-100">
                                        {urls.length > 0 
                                            ? Math.round(urls.reduce((total, url) => total + url.clicks, 0) / urls.length) 
                                            : 0}
                                    </h3>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-full">
                                    <UserIcon className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                        <TabsTrigger value="list" className="text-slate-200 data-[state=active]:bg-slate-700">URL List</TabsTrigger>
                        <TabsTrigger value="analytics" className="text-slate-200 data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                        <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-slate-100">Your Shortened URLs</CardTitle>
                                <CardDescription className="text-slate-300">
                                    View and manage all your shortened URLs
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                                    </div>
                                ) : urls.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-300">No URLs found. Create your first shortened URL on the home page!</p>
                                        <Button className="mt-4" variant="outline" asChild>
                                            <Link href="/" className="text-slate-200 border-slate-700 hover:bg-slate-700">Go to URL Shortener</Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-700">
                                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Short URL</th>
                                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Original URL</th>
                                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Created</th>
                                                    <th className="text-left py-3 px-4 font-medium text-slate-300">Clicks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {urls.map((url, index) => (
                                                    <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/50">
                                                        <td className="py-3 px-4">
                                                            <Link href={url.shortUrl} target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors">
                                                                {url.shortUrl.split('/').pop()}
                                                            </Link>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="max-w-[200px] truncate text-slate-300">
                                                                {url.url}
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-300">
                                                            {new Date(url.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">
                                                                {url.clicks} clicks
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="analytics">
                        <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-slate-100">URL Performance</CardTitle>
                                <CardDescription className="text-slate-300">
                                    Visualize how your shortened URLs are performing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                                    </div>
                                ) : urls.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-slate-300">No data available. Create some URLs to see analytics!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="h-80 w-full">
                                            <h3 className="text-lg font-medium mb-4 text-slate-100">Clicks per URL</h3>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={clicksData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                    <XAxis dataKey="name" stroke="#9CA3AF" />
                                                    <YAxis stroke="#9CA3AF" />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: '#1F2937', 
                                                            borderColor: '#374151',
                                                            color: '#F9FAFB'
                                                        }} 
                                                    />
                                                    <Bar dataKey="clicks" fill="#3B82F6" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DashboardPage;
