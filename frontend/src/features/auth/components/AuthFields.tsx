import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { AuthFormValues, AuthMode } from "../types/auth-form.types";

function FieldIcon({ type }: { type: "email" | "name" | "password" }) {
  const Icon = type === "email" ? Mail : type === "name" ? UserRound : LockKeyhole;
  return <Icon aria-hidden="true" className="text-muted-foreground absolute top-3.5 left-3 size-4" />;
}

type Props = { form: UseFormReturn<AuthFormValues>; mode: AuthMode };

function DisplayNameField({ form }: Pick<Props, "form">) {
  const translate = useTranslations("auth");
  return (
    <FormField control={form.control} name="displayName" render={({ field }) => (
      <FormItem><FormLabel>{translate("DISPLAY_NAME_LABEL")}</FormLabel><FormControl><div className="relative"><FieldIcon type="name" /><Input className="pl-10" placeholder={translate("DISPLAY_NAME_PLACEHOLDER")} {...field} /></div></FormControl><FormMessage /></FormItem>
    )} />
  );
}

function EmailField({ form }: Pick<Props, "form">) {
  const translate = useTranslations("auth");
  return <FormField control={form.control} name="email" render={({ field }) => (
    <FormItem><FormLabel>{translate("EMAIL_LABEL")}</FormLabel><FormControl><div className="relative"><FieldIcon type="email" /><Input className="pl-10" autoComplete="email" type="email" placeholder={translate("EMAIL_PLACEHOLDER")} {...field} /></div></FormControl><FormMessage /></FormItem>
  )} />;
}

function PasswordField({ form, mode }: Props) {
  const translate = useTranslations("auth");
  return <FormField control={form.control} name="password" render={({ field }) => (
    <FormItem><FormLabel>{translate("PASSWORD_LABEL")}</FormLabel><FormControl><div className="relative"><FieldIcon type="password" /><Input className="pl-10" autoComplete={mode === "register" ? "new-password" : "current-password"} type="password" placeholder={translate("PASSWORD_PLACEHOLDER")} {...field} /></div></FormControl>{mode === "register" && <FormDescription>{translate("TXT_PASSWORD_RULE")}</FormDescription>}<FormMessage /></FormItem>
  )} />;
}

export function AuthFields({ form, mode }: Props) {
  return <>{mode === "register" && <DisplayNameField form={form} />}<EmailField form={form} /><PasswordField form={form} mode={mode} /></>;
}
