import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(req) {
    try {
        const secret = process.env.NEXTAUTH_SECRET;
        const token = await getToken({ req, secret });

        if (!token) {
            return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
        }

        await connectMongoDB();

        // Find the user by their email and increment their score by 1
        const user = await User.findOne({ email: token.email });
        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        user.scores += 1;
        await user.save();

        return NextResponse.json({ message: "Score updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error updating score:", error);
        return NextResponse.json({ message: "An error occurred while updating the score." }, { status: 500 });
    }
}
