import {NextRequest, NextResponse} from "next/server";
import {getUrlByCode, incrementUrlClicks} from "@/actions/URLShorteningAction";

export async function GET(request: NextRequest) {
    const shortUrl = request.nextUrl.pathname.split("/").pop();
    const result = await getUrlByCode(shortUrl!);
    if(result.success) {
        await incrementUrlClicks(shortUrl!);
        return NextResponse.redirect(result.url);
    } else {
        return NextResponse.json({message: request.nextUrl.pathname.split("/").pop()});
    }
}
