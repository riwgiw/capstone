import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(req) {
    try {
        // Connect to MongoDB
        await connectMongoDB();

        
        const users = await User.find();
        

        return NextResponse.json(users, { status: 200 });

    } catch (error) {
        console.error("Error occurred while fetching data from MongoDB:", error);
        return NextResponse.json({ message: "An error occurred while fetching data from MongoDB." }, { status: 500 });
    }
}
