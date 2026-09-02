import { getRequestConfig } from "next-intl/server";

import { defaultLocale, defaultTimeZone } from "./config";
import { messagesByLocale } from "./messages";

export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: messagesByLocale[defaultLocale],
  timeZone: defaultTimeZone,
}));
