
import { NextResponse } from "next/server";
import { createClerkClient } from '@clerk/nextjs/server';

const clerk = createClerkClient({
    secretKey: "sk_test_a2CeQL0IF2269jFZ9n4qaafBsRaUYY2A2F1IZtrfGq"
});

export async function GET(req: Request) {
    try {
        const res = await clerk.users.getUserList();
        return NextResponse.json(res);
    }
    catch (error) {
        console.log("[Users]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


