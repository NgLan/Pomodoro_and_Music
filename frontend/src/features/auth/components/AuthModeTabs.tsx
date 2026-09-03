import { useTranslations } from "next-intl";

import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import type { AuthMode } from "../types/auth-form.types";

export function AuthModeTabs({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (value: string) => void;
}) {
  const translate = useTranslations("auth");
  return (
    <Tabs value={mode} onValueChange={onChange}>
      <TabsList className="border-border bg-muted h-auto w-full border-2 p-1">
        <TabsTrigger className="min-h-11" value="login">
          {translate("TXT_LOGIN_TAB")}
        </TabsTrigger>
        <TabsTrigger className="min-h-11" value="register">
          {translate("TXT_REGISTER_TAB")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
