import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Game from "../../../../models/game";

export async function POST(req) {
    try {
        const { id } = await req.json();
        console.log("Received id:", id);

        await connectMongoDB();

        const game = await Game.findById(id);
        if (!game) {
            return NextResponse.json({ message: "Game not found." }, { status: 404 });
        }
        console.log("Found game:", game);

        game.humanclick += 1;
        await game.save();
        console.log("Updated game:", game);

        return NextResponse.json({ message: "Human click updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error updating human click:", error);
        return NextResponse.json({ message: "An error occurred while updating the human click." }, { status: 500 });
    }
}
