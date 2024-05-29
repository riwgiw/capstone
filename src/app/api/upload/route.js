import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Game from "../../../../models/game";

export async function POST(req) {
    try {
        const { url,result } = await req.json();

        if (!url || !result) {
            return NextResponse.json({ message: "Incomplete data." }, { status: 400 });
        }

        await connectMongoDB();
        await Game.create({ url,result })

        return NextResponse.json({ message: "Game Registerd."}, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "An error occured while registrating the Game." }, { status: 500 });
    }
}