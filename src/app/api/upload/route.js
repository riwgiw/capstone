import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/game";
import bcrypt from 'bcryptjs'

export async function POST(req) {
    try {
        const { url,result } = await req.json();

        console.log(req.json());
        await connectMongoDB();
        await User.create({url,result })

        return NextResponse.json({ message: "User Registerd."}, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "An error occured while registrating the user." }, { status: 500 });
    }
}