import React, {useEffect} from 'react'
import Link from "next/link";
import {CopyIcon} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


type shortUrlOutputProps = {
    shortUrl: string
}

const ShortUrlOutput = (props: shortUrlOutputProps) => {

    useEffect(() => {
        setCopied(false);
    }, [props.shortUrl]);

    const [copied, setCopied] = React.useState<boolean>(false);

    function copyToClipboard() {
        navigator.clipboard.writeText(props.shortUrl).then(() => {
            console.log("Copied to clipboard");
            setCopied(true);
        });
    }

    return (
        <div className="mt-5 border p-5 bg-gray-800 rounded-lg flex flex-row justify-between">
            <Link target="_blank" href={props.shortUrl} className="text-blue-500">
                {props.shortUrl}
            </Link>
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                        <CopyIcon className="ml-2 cursor-pointer bg-muted"
                                  onClick={copyToClipboard} />
                    </TooltipTrigger>
                    <TooltipContent side={"right"}>
                        {copied ? <p>Copied</p> :  <p>Copy to clipboard</p> }
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>

    )
}
export default ShortUrlOutput
