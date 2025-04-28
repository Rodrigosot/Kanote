"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronLast, ChevronFirst, DoorClosed, CircleDollarSign, ClipboardCheck, HomeIcon, KanbanSquare, Settings } from "lucide-react";
import { createContext, useState, useEffect } from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarItem } from "./SideBarItem";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({ name, picture, email }: { name: string; picture: string; email: string }) {
  const path = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <span className={`text-3xl font-extrabold text-bold overflow-hidden transition-all ${expanded ? "w-32" : "w-0"}`}>kanote</span>
          <button title="button expanded" onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg">
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          <Link href="/dashboard/inicio">
            <SidebarItem expanded={expanded} icon={<HomeIcon className="text-primary" />} text="Inicio" active={path === "/dashboard/inicio" ? true : false}></SidebarItem>
          </Link>
          <Link href="/dashboard/tareas">
            <SidebarItem icon={<ClipboardCheck className="text-primary" />} text="Tareas" expanded={expanded} active={path === "/dashboard/tareas" ? true : false}></SidebarItem>
          </Link>
          <Link href="/dashboard/kanban">
            <SidebarItem icon={<KanbanSquare className="text-primary" />} text="Kanban" expanded={expanded} active={path === "/dashboard/kanban" ? true : false}></SidebarItem>
          </Link>
          <Link href="/dashboard/pagos">
            <SidebarItem icon={<CircleDollarSign className="text-primary" />} text="Pagos" expanded={expanded} active={path === "/dashboard/pagos" ? true : false}></SidebarItem>
          </Link>
          <hr className="my-3" />
          <Link href="/dashboard/configuracion">
            <SidebarItem icon={<Settings className="text-primary" />} text="Configuracion" expanded={expanded} active={path === "/dashboard/configuracion" ? true : false}></SidebarItem>
          </Link>
        </ul>

        <div className="border-t flex p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative p-0">
                <Avatar>
                  <AvatarImage src={picture} alt="profile-image"></AvatarImage>
                  <AvatarFallback>{name[0] || ""}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full flex justify-between items-center" asChild>
                <LogoutLink className="px-2">
                  Salir{" "}
                  <span>
                    <DoorClosed className="w-4 h-4"></DoorClosed>
                  </span>
                </LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold ">{name}</h4>
              <span className="text-xs">{email}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button title="button-menu" variant="ghost" className="relative">
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-full flex justify-between items-center" asChild>
                  <LogoutLink className="px-2">
                    Salir{" "}
                    <span>
                      <DoorClosed className="w-4 h-4"></DoorClosed>
                    </span>
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
}
