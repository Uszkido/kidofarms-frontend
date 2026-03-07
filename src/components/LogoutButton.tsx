"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 hover:bg-white/10 rounded-full transition-all group"
            title="Log Out"
        >
            <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
        </button>
    );
}
