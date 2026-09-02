"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { getErrorMessageKey } from "@/shared/lib/error-message";
import {
  isNotificationMessageKey,
  type NotificationMessageKey,
} from "@/shared/i18n/types";

type NotificationParams = Record<string, Date | number | string>;

/** Exposes semantic, translated notifications without leaking the toast library. */
export function useAppNotification() {
  const translateNotification = useTranslations("notifications");
  const translateError = useTranslations("errors");

  return {
    success(key: NotificationMessageKey, params?: NotificationParams) {
      toast.success(translateNotification(key, params));
    },
    error(errorCodeOrKey: string, params?: NotificationParams) {
      if (isNotificationMessageKey(errorCodeOrKey)) {
        toast.error(translateNotification(errorCodeOrKey, params));
        return;
      }

      toast.error(translateError(getErrorMessageKey(errorCodeOrKey), params));
    },
    warning(key: NotificationMessageKey, params?: NotificationParams) {
      toast.warning(translateNotification(key, params));
    },
    info(key: NotificationMessageKey, params?: NotificationParams) {
      toast.info(translateNotification(key, params));
    },
  };
}
