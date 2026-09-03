"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { useAuth } from "@/shared/providers/auth-provider";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";

export function UserMenu() {
  const translate = useTranslations("auth");
  const { logout, user } = useAuth();
  const client = useQueryClient();
  const notification = useAppNotification();
  const signOut = async () => {
    await logout();
    client.clear();
    notification.success("MSG_LOGOUT_SUCCESS");
  };
  const initials = (user?.displayName ?? user?.email ?? translate("TXT_GUEST")).slice(0, 2).toUpperCase();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label={translate("ARIA_USER_MENU")}><span className="text-xs">{initials}</span></Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-border shadow-neo w-56 border-2">
        <div className="border-border mb-1 border-b-2 px-2 py-2">
          <strong className="block truncate text-sm">{user?.displayName ?? translate("TXT_GUEST")}</strong>
          <span className="text-muted-foreground block truncate text-xs">{user?.email}</span>
        </div>
        <DropdownMenuItem onSelect={() => void signOut()}><LogOut aria-hidden="true" />{translate("BTN_LOGOUT")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
