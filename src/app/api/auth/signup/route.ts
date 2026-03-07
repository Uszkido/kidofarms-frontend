import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
        }

        await dbConnect();
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashed,
            role: "customer",
        });

        return NextResponse.json(
            { message: "Account created successfully!", userId: user._id },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
