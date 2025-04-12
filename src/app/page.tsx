'use client';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ShortUrlOutput from "@/components/ShortUrlOutput";
import React, {useEffect, useState} from "react";
import {Toaster, toast} from "sonner";
import {chopit, getUrlStats, Url} from "@/actions/URLShorteningAction";
import Link from "next/link";
import validator from "validator";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LinkIcon, DownloadIcon, BarChart3Icon, SparklesIcon } from "lucide-react";

export default function Home() {
    const [shortUrl, setShortUrl] = useState<string>("");
    const [recentUrls, setRecentUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [qrCode, setQrCode] = useState<string>("");
    const [urlInput, setUrlInput] = useState<string>("");
    const [customSlug, setCustomSlug] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    function handleDownload() {
        const a = document.createElement("a");
        a.href = qrCode;
        a.download = "chopit-qrcode.png";
        a.click();
    }

    async function handleShorten(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if(!validator.isURL(urlInput)) {
                toast.error("Please enter a valid URL");
                return;
            }
            
            const result = await chopit(urlInput, customSlug);
            setShortUrl(result.url);
            setQrCode(result.qrCode);
            fetchRecentUrls();
            toast.success("URL shortened successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to shorten URL");
        } finally {
            setIsSubmitting(false);
        }
    }

    function fetchRecentUrls() {
        getUrlStats()
            .then(res => res.urls)
            .then(data => {
                setRecentUrls(data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to fetch recent URLs");
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetchRecentUrls();
    },[]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Chop It - URL Shortener
                    </h1>
                    <p className="text-lg text-slate-200 max-w-2xl mx-auto">
                        Transform long URLs into short, memorable links. Track clicks and generate QR codes in seconds.
                    </p>
                </div>

                {/* Main Card */}
                <Card className="border-0 shadow-xl bg-slate-800/50 backdrop-blur">
                    <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                            <SparklesIcon className="h-8 w-8 text-purple-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-slate-100">
                            Shorten Your URL
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                            Make your long URLs short, trackable, and easy to share
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleShorten}>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <LinkIcon className="mr-2 h-4 w-4 text-blue-500" />
                                        <label htmlFor="longURL" className="text-sm font-medium text-slate-200">
                                            Long URL
                                        </label>
                                    </div>
                                    <Input 
                                        required 
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        id="longURL" 
                                        name="longURL" 
                                        placeholder="https://example.com/very/long/url/that/needs/shortening" 
                                        type="text"
                                        className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                
                                <div>
                                    <div className="flex items-center mb-2">
                                        <LinkIcon className="mr-2 h-4 w-4 text-purple-500" />
                                        <label htmlFor="customSlug" className="text-sm font-medium text-slate-200">
                                            Custom slug (optional)
                                        </label>
                                    </div>
                                    <Input 
                                        value={customSlug}
                                        onChange={(e) => setCustomSlug(e.target.value)}
                                        id="customSlug" 
                                        name="customSlug" 
                                        placeholder="my-custom-url" 
                                        type="text"
                                        className="bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-white"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Chop It!"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
                
                {shortUrl && <ShortUrlOutput shortUrl={shortUrl} />}
                
                {qrCode && (
                    <Card className="mt-6 border-purple-500/20 shadow-lg shadow-purple-500/5 bg-slate-800/50">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="bg-white p-4 rounded-lg shadow-lg">
                                    <Image 
                                        width={200} 
                                        height={200} 
                                        src={qrCode} 
                                        alt="QR Code" 
                                        className="w-40 h-40"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium mb-2 text-slate-100">QR Code Generated!</h3>
                                    <p className="text-slate-300 mb-4 text-sm">
                                        Scan this QR code to access your shortened URL. Perfect for print materials or in-person sharing.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex items-center gap-2 hover:bg-purple-500/10 text-slate-200 border-slate-700"
                                        onClick={handleDownload}
                                    >
                                        <DownloadIcon className="h-4 w-4" />
                                        Download QR Code
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                <Card className="mt-10 border-0 shadow-xl bg-slate-800/50 backdrop-blur">
                    <CardHeader className="pb-2">
                        <div className="flex items-center">
                            <BarChart3Icon className="mr-2 h-5 w-5 text-blue-500" />
                            <CardTitle className="text-slate-100">Recent URLs</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center items-center p-8">
                                <div className="h-10 w-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
                            </div>
                        ) : recentUrls.length === 0 ? (
                            <div className="text-center py-8 text-slate-300">
                                <p>No URLs found. Create your first shortened URL above!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentUrls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors group"
                                    >
                                        <Link
                                            target="_blank"
                                            href={url.shortUrl}
                                            className="text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[70%] group-hover:underline"
                                        >
                                            {url.shortUrl}
                                        </Link>
                                        <div className="flex items-center text-sm font-medium">
                                            <span className="text-slate-300">{url.clicks}</span>
                                            <span className="ml-1 text-slate-400">clicks</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <footer className="mt-12 text-center text-slate-400 text-sm">
                    <p>© {new Date().getFullYear()} Chop It. All rights reserved.</p>
                    <p className="mt-2">Made with ❤️ for a better web experience</p>
                </footer>
            </div>
            
            <Toaster richColors position="top-center" />
        </div>
    );
}
