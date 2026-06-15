import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        console.log("Login attempt for email:", email);

        if (!email || !password) {
            return NextResponse.json({ error: "email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log("User found:", user.email);
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        console.log("Login successful");
        return NextResponse.json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Error logging in user:", error);
        return NextResponse.json({ error: "Error logging in user" }, { status: 500 });
    }
}