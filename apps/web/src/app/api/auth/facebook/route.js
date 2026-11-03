import { NextResponse } from "next/server";
export async function GET(request) {
    return NextResponse.redirect(new URL("/login?oauthError=Login%20social%20indisponível%20nesta%20etapa.", request.url));
}
