"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "@/components/ui/use-toast";

function Submitbutton() {
  const { pending } = useFormStatus();
  const { toast } = useToast();

  return (
    <>
      {" "}
      {pending ? (
        <Button disabled className="w-fit">
          {" "}
          <Loader2 className="mr-2 w-4 h-4 animate-spin"></Loader2>
          Porfavor espera
        </Button>
      ) : (
        <Button
          className="w-fit"
          type="submit"
          onClick={() => {
            toast({
              title: "Datos actualizados",
            });
          }}
        >
          Guardar
        </Button>
      )}
    </>
  );
}

export default Submitbutton;

export function StripeSubscriptionCreationButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className="w-full">
          <Loader2 className="mr-2 w-4 h-4 animate-spin"></Loader2>
          Porfavor espera
        </Button>
      ) : (
        <Button type="submit" className="w-full">
          Comprar ahora
        </Button>
      )}
    </>
  );
}
