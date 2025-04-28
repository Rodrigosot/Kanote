import { ThemeToggle } from "@/app/components/Themetoggle";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem, SelectLabel, SelectGroup, SelectTrigger, Select, SelectContent, SelectValue } from "@/components/ui/select";
import React from "react";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Submitbuttons from "@/app/components/Submitbutton";
import { revalidatePath } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      colorScheme: true,
    },
  });

  return data;
}

export default async function settingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const data = await getData(user?.id as string);

  async function postData(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const colorScheme = formData.get("color") as string;

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name: name ?? undefined,
        colorScheme: colorScheme ?? undefined,
      },
    });

    revalidatePath("/", "layout");
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-3xl ">Configuración</h1>
        <ThemeToggle />
      </div>

      <div className="grid items-start gap-8 pt-4">
        <Card>
          <form action={postData}>
            <CardHeader>
              <CardTitle>Información general</CardTitle>
              <CardDescription>Proporcione información general sobre usted. Por favor no olvides guardar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label>Tu nombre</Label>
                  <Input name="name" type="text" id="name" placeholder="Tu nombre" defaultValue={data?.name ?? undefined}></Input>
                </div>
                <div className="space-y-1">
                  <Label>Tu correo</Label>
                  <Input name="email" type="email" id="email" placeholder="Tu correo" disabled defaultValue={data?.email}></Input>
                </div>
                <div className="space-y-1">
                  <Label>Esquema de color</Label>
                  <Select name="color" defaultValue={data?.colorScheme}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un color"></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Color</SelectLabel>
                        <SelectItem value="theme-green">Verde</SelectItem>
                        <SelectItem value="theme-blue">Azul</SelectItem>
                        <SelectItem value="theme-violet">Purpura</SelectItem>
                        <SelectItem value="theme-yellow">Amarillo</SelectItem>
                        <SelectItem value="theme-orange">Naranja</SelectItem>
                        <SelectItem value="theme-rose">Rosa</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Submitbuttons />
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
