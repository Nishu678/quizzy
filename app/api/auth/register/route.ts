import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await request.json();
        console.log("Register attempt:", { name, email, passwordLength: password?.length });

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        console.log("Creating user with password:", password);
        const user = await User.create({ name, email, password });
        console.log("User created. Password in DB:", user.password);

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        const errorMessage = error instanceof Error ? error.message : "Error creating user";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}