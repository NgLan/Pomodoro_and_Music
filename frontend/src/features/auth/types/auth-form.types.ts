import type { LoginRequestDto, RegisterRequestDto } from "@/api";

export type AuthMode = "login" | "register";
export type AuthFormValues = LoginRequestDto &
  Pick<RegisterRequestDto, "displayName">;
