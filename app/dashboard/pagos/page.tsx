import { ThemeToggle } from "@/app/components/Themetoggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import React from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStripeSession } from "@/app/lib/stripe";
import { redirect } from "next/navigation";
import { StripeSubscriptionCreationButton } from "@/app/components/Submitbutton";

async function getData(userId: string) {
  const data = await prisma.suscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerID: true,
        },
      },
    },
  });

  return data;
}

async function page() { 
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function createSession() {
    "use server";

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      select: {
        stripeCustomerID: true,
      },
    });

    if (!dbUser?.stripeCustomerID) {
      throw new Error("No se ha encontrado un cliente de stripe");
    }

    const session = await getStripeSession({
      customerId: dbUser.stripeCustomerID,
      domainUrl: "http://localhost:3000",
      priceId: process.env.STRIPE_PRICE_ID as string,
    });

    return redirect(session);
  }

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-3xl ">Suscripción</h1>
        <ThemeToggle />
      </div>
      <div className="max-w-sm mx-auto mt-10 ">
        <Card className="border-primary border-2">
          <CardContent className="py-8">
            <div>
              <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary/10 text-primary">Mensual</h3>
            </div>
            <div className="mt-4 flex items-baseline text-5xl font-extralight">
              $149.99 <span className="text-2xl text-muted-foreground">/mes</span>
            </div>
            <p className="mt-5 text-lg text-muted-foreground">Escribe notas ilimitadas desde 149.99 cada mes</p>
          </CardContent>
          <CardFooter>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-secondary rounded-lg m-1 space-y-6 sm:p-10 sm:pt-6">
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary"></CheckCircle2>
                  </div>
                  <p className="ml-3 font-light">Notas ilimitadas</p>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary"></CheckCircle2>
                  </div>
                  <p className="ml-3 font-light">Sin anuncios</p>
                </li>
                <li className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary"></CheckCircle2>
                  </div>
                  <p className="ml-3 font-light">Funciones adicionales</p>
                </li>
              </ul>
              <form action={createSession}>
                <StripeSubscriptionCreationButton />
              </form>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default page;
