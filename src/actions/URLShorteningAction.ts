'use server';

import {customAlphabet} from "nanoid";
import {init} from "@/lib/init-mongodb";
import Url from "@/models/URL";
import QRCode from "qrcode";


type ValidationResponse = {
    success: boolean
    error?: string
}

export type Url = {
    url: string
    shortUrl: string
    urlCode: string
    createdAt: Date
    clicks: number
}

export const chopit = async (url: string, customString: string):Promise<{url:string, qrCode:string}> => {

    await init();

    let shortUrlCode = generateRandomString(6);

    if (customString) {
        const validationResponse = await validateSlug(customString);
        if (!validationResponse.success) {
            throw new Error(validationResponse.error);
        }
        shortUrlCode = customString;
    } else {
        let existingUrl = await Url.findOne({ urlCode: shortUrlCode });
        while (existingUrl) {
            shortUrlCode = generateRandomString(6);
            existingUrl = await Url.findOne({urlCode: shortUrlCode});
        }
    }

    const shortUrl = new Url({
        url: url,
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrlCode}`,
        urlCode: shortUrlCode,
        createdAt: new Date(),
        clicks: 0
    });

    const result = await shortUrl.save();

    const qrCode = await QRCode.toDataURL(result.shortUrl);

    return { url: result.shortUrl, qrCode: qrCode };
}

function generateRandomString(length: number): string {
    const nanoid =
        customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', length);
    return nanoid();
}

async function validateSlug(slug: string): Promise<ValidationResponse> {
    const validSlugRegex = /^[a-zA-Z0-9-_]+$/
    if (!validSlugRegex.test(slug)) {
        return {
            success: false,
            error: 'Slug can only contain letters, numbers, hyphens, and underscores'
        }
    }

    const existingUrl = await Url.findOne({ urlId: slug })
    if (existingUrl) {
        return {
            success: false,
            error: 'This custom slug is already in use'
        }
    }

    return { success: true }
}

export async function getUrlStats(): Promise<{urls: Url[]}> {
    await init()

    try {
        const urls: Url[] = await Url.find().sort({ createdAt: -1 }).limit(10);
        const customUrls: Url[] = urls.map(url => ({
            url: url.url,
            shortUrl: url.shortUrl,
            urlCode: url.urlCode,
            createdAt: url.createdAt,
            clicks: url.clicks
        }));
        return { urls: customUrls }
    } catch (error) {
        console.error('Error fetching URLs:', error)
        return { urls: [] }
    }
}

export async function getUrlByCode(urlCode: string) {
    await init()

    try {
        const url = await Url.findOne({ urlCode })
        if (url) {
            return { success: true, url: url.url }
        } else {
            return { success: false, error: 'URL not found' }
        }
    } catch (error) {
        console.error('Error fetching URL:', error)
        return { success: false, error: 'Failed to fetch URL' }
    }
}

export async function incrementUrlClicks(urlId: string) {
    await init()

    try {
        const url = await Url.findOneAndUpdate(
            { urlCode: urlId },
            { $inc: { clicks: 1 } },
            { new: true }
        )
        return { success: true, url }
    } catch (error) {
        console.error('Error updating click count:', error)
        return { success: false, error: 'Failed to update click count' }
    }
}
