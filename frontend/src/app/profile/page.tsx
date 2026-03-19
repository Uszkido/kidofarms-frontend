import { redirect } from "next/navigation";

export default function ProfilePage() {
    // Redirect to the buyer dashboard since /profile is not used but often hit
    redirect("/dashboard/buyer");
}
