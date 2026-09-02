"use client";

import { useTranslations } from "next-intl";

import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { Button } from "@/shared/ui/button";

export function FoundationNotificationButton() {
  const translate = useTranslations("common");
  const notification = useAppNotification();

  return (
    <Button onClick={() => notification.success("MSG_SUCCESS")}>
      {translate("BTN_GET_STARTED")}
    </Button>
  );
}
