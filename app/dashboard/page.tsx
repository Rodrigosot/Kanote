import { redirect } from "next/navigation";
import React from "react";

export function DashboardPage() {
  redirect("/dashboard/inicio");
}

export default DashboardPage;
