'use client';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import ShortUrlOutput from "@/components/ShortUrlOutput";
import React, {useEffect} from "react";
import {Toaster} from "sonner";
import {chopit, getUrlStats, Url} from "@/actions/URLShorteningAction";
import Link from "next/link";
import validator from "validator";

export default function Home() {

    const [shortUrl, setShortUrl] = React.useState<string>("");
    const [recentUrls, setRecentUrls] = React.useState<Url[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);

    async function handleShorten(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const url = formData.get("longURL") as string;
        console.log(url);
        console.log("Shorten URL");
        if(validator.isURL(url)) {
            const shortUrl = await chopit(url, "");
            setShortUrl(shortUrl);
            fetchRecentUrls();
        } else {
            alert("Please enter a valid URL");
        }

    }

    function fetchRecentUrls() {
        getUrlStats()
            .then(res => res.urls)
            .then(data => {
                setRecentUrls(data);
                setLoading(false);
            });
    }

    useEffect(() => {
        setLoading(true);
        fetchRecentUrls();
    },[]);

  return (
      <div className="max-w-lg mx-auto">
          <div className="mt-10 flex flex-col justify-between">
              <form className="w-full flex flex-row gap-5 justify-between" onSubmit={handleShorten}>
                  <Input required className="w-full" id={"longURL"} name={"longURL"} placeholder={"Enter URL"} type={"text"}/>
                  <Button type="submit" variant="default" size="lg">ChopIt</Button>
              </form>
              {shortUrl && <ShortUrlOutput shortUrl={shortUrl}/>}
          </div>
          <div className="mt-5">
              <h1 className="text-2xl font-bold mb-4">Recent URLs</h1>
              {loading ? (
                  <div className="flex justify-center items-center">
                      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                  </div>
              ) : recentUrls.length === 0 ? (
                  <p>No URLs found</p>
              ) : (
                  <ul className="space-y-2">
                      {recentUrls.map((url, index) => (
                          <li
                              key={index}
                              className="flex flex-row justify-between items-center p-2 border rounded-lg shadow-sm"
                          >
                              <Link
                                  target="_blank"
                                  href={url.urlCode}
                                  className="text-blue-500 hover:underline"
                              >
                                  {url.shortUrl}
                              </Link>
                              <span className="text-gray-600">{url.clicks} clicks</span>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
          <Toaster/>
      </div>
  );
}
