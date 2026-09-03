"use client";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { useAuthForm } from "../hooks/use-auth-form";
import { AuthModeTabs } from "./AuthModeTabs";
import { AuthSubmitForm } from "./AuthSubmitForm";

export function AuthFormCard() {
  const translate = useTranslations("auth");
  const state = useAuthForm();
  return (
    <Card className="bg-surface p-1 sm:p-4">
      <CardHeader>
        <AuthModeTabs mode={state.mode} onChange={state.changeMode} />
        <CardTitle className="pt-4 text-2xl">
          {translate(state.mode === "login" ? "TXT_LOGIN_TAB" : "TXT_REGISTER_TAB")}
        </CardTitle>
        <CardDescription>{translate("TXT_WELCOME_DESCRIPTION")}</CardDescription>
      </CardHeader>
      <CardContent><AuthSubmitForm state={state} /></CardContent>
    </Card>
  );
}
