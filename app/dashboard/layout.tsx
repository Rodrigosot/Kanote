// "use client";

import React from "react";
import SideBar from "../components/SideBar";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "../lib/db";
import { ThemeProvider } from "../components/theme-provider";
import { stripe } from "../lib/stripe";

async function getData({ email, id, firstName, lastName, profileImage }: { email: string; id: string; firstName: string | undefined | null; lastName: string | undefined | null; profileImage: string | undefined | null }) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerID: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if (!user?.stripeCustomerID) {
    const data = await stripe.customers.create({
      email: email,
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerID: data.id,
      },
    });
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/");
  }

  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id as string,
    },
    select: {
      name: true,
      email: true,
    },
  });

  await getData({ email: user.email as string, firstName: user.given_name as string, id: user.id as string, lastName: user.family_name as string, profileImage: user.picture });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex">
        <SideBar email={user.email as string} name={userInfo?.name as string} picture={user.picture as string}></SideBar>

        <main className="h-screen w-full p-10 ">{children}</main>
      </div>
    </ThemeProvider>
  );
}
