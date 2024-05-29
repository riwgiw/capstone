import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Game from "../../../../models/game";

export async function POST(req) {
    try {

        const { id } = await req.json();
        
        await connectMongoDB();

        const game = await Game.findById(id);

        console.log(game)
        if (!game) {
            return NextResponse.json({ message: "Game not found." }, { status: 404 });
        }

        game.aiclick += 1;
        await game.save();

        return NextResponse.json({ message: "Ai click updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error updating ai click:", error);
        return NextResponse.json({ message: "An error occurred while updating the ai click." }, { status: 500 });
    }
}
