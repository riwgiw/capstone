import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/game";

export async function POST(req) {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        // Fetch all users (or modify as needed)
        const users = await User.find();
        console.log(users);

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        console.error("Error occurred while fetching data from MongoDB:", error);
        return NextResponse.json({ message: "An error occurred while fetching data from MongoDB." }, { status: 500 });
    }
}
