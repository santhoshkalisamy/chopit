import React, {useEffect} from 'react'
import Link from "next/link";
import {CopyIcon, CheckIcon, ExternalLinkIcon} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ShortUrlOutputProps = {
    shortUrl: string
}

const ShortUrlOutput = ({shortUrl}: ShortUrlOutputProps) => {
    useEffect(() => {
        setCopied(false);
    }, [shortUrl]);

    const [copied, setCopied] = React.useState<boolean>(false);

    function copyToClipboard() {
        navigator.clipboard.writeText(shortUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <Card className="mt-6 border-blue-500/20 shadow-lg shadow-blue-500/5">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full truncate">
                        <p className="text-sm text-gray-400 mb-1">Your shortened URL:</p>
                        <Link 
                            target="_blank" 
                            href={shortUrl} 
                            className="text-blue-500 hover:text-blue-400 font-medium transition-colors truncate block"
                        >
                            {shortUrl}
                        </Link>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1"
                            onClick={copyToClipboard}
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="h-4 w-4" />
                                    <span>Copy</span>
                                </>
                            )}
                        </Button>
                        <TooltipProvider>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="h-8 w-8"
                                        asChild
                                    >
                                        <Link href={shortUrl} target="_blank">
                                            <ExternalLinkIcon className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Open in new tab
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ShortUrlOutput
