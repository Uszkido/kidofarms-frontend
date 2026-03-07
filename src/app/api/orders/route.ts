import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { items, totalAmount, street, city, state, zip, paymentMethod } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in order" }, { status: 400 });
        }

        // 1. Create Order
        const [newOrder] = await db.insert(orders).values({
            userId: (session.user as any).id,
            totalAmount: totalAmount.toString(),
            street,
            city,
            state,
            zip,
            paymentMethod: paymentMethod || "card",
            paymentStatus: "pending",
            orderStatus: "processing",
        }).returning();

        // 2. Create Order Items
        const itemsToInsert = items.map((item: any) => ({
            orderId: newOrder.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price.toString(),
        }));

        await db.insert(orderItems).values(itemsToInsert);

        return NextResponse.json({ message: "Order placed successfully!", orderId: newOrder.id }, { status: 201 });
    } catch (error: any) {
        console.error("Order error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
