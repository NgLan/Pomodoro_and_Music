"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppNotification } from "@/shared/hooks/use-app-notification";
import { normalizeApiError } from "@/shared/lib/api-error";
import { useAuth } from "@/shared/providers/auth-provider";
import { createAuthFormSchema } from "../schemas/auth-form.schema";
import type { AuthFormValues, AuthMode } from "../types/auth-form.types";

function useAuthenticate(mode: AuthMode) {
  const notification = useAppNotification();
  const { login, register } = useAuth();
  return async (values: AuthFormValues) => {
    try {
      if (mode === "register") await register(values);
      else await login({ email: values.email, password: values.password });
      notification.success(mode === "register" ? "MSG_REGISTER_SUCCESS" : "MSG_LOGIN_SUCCESS");
      return null;
    } catch (error) {
      const code = normalizeApiError(error).errorCode;
      notification.error(code);
      return code;
    }
  };
}

export function useAuthForm() {
  const translate = useTranslations("auth");
  const [mode, setMode] = useState<AuthMode>("login");
  const [requestErrorCode, setRequestErrorCode] = useState<string | null>(null);
  const authenticate = useAuthenticate(mode);
  const schema = useMemo(() => createAuthFormSchema(mode, translate), [mode, translate]);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { displayName: "", email: "", password: "" },
  });
  const changeMode = (value: string) => {
    setMode(value as AuthMode);
    setRequestErrorCode(null);
    form.clearErrors();
  };
  const submit = form.handleSubmit(async (values) => {
    setRequestErrorCode(null);
    setRequestErrorCode(await authenticate(values));
  });
  return { changeMode, form, mode, requestErrorCode, submit };
}
