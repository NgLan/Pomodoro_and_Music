import { z } from "zod";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

type ValidationKey =
  | "MSG_EMAIL_INVALID"
  | "MSG_PASSWORD_INVALID"
  | "MSG_PASSWORD_REQUIRED";
type Translate = (key: ValidationKey) => string;

export function createAuthFormSchema(
  mode: "login" | "register",
  translate: Translate,
) {
  const password =
    mode === "register"
      ? z.string().regex(PASSWORD_PATTERN, translate("MSG_PASSWORD_INVALID"))
      : z.string().min(1, translate("MSG_PASSWORD_REQUIRED"));
  return z.object({
    displayName: z.string().max(120).optional(),
    email: z.string().email(translate("MSG_EMAIL_INVALID")),
    password,
  });
}
