import { redirect } from "next/navigation";

// The dashboard now lives at the root route, which renders the desktop layout
// on wide viewports and the mobile app on narrow ones.
export default function DashboardRedirect() {
  redirect("/");
}
