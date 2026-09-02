import { isErrorMessageKey, type ErrorMessageKey } from "@/shared/i18n/types";

export function getErrorMessageKey(errorCode: string): ErrorMessageKey {
  return isErrorMessageKey(errorCode) ? errorCode : "UNKNOWN";
}
