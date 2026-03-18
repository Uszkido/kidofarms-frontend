import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (process.env.NEXT_OUTPUT === "export") {
        return <>{children}</>;
    }
    const session = await getServerSession(authOptions);

    const role = (session?.user as any)?.role;

    if (!session || (role !== "admin" && role !== "sub-admin")) {
        redirect("/");
    }

    return <>{children}</>;
}
