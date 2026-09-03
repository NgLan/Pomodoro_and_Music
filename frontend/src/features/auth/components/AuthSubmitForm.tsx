import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import type { ReturnTypeOfUseAuthForm } from "../types/use-auth-form.types";
import { AuthFields } from "./AuthFields";

export function AuthSubmitForm({ state }: { state: ReturnTypeOfUseAuthForm }) {
  const translate = useTranslations("auth");
  return (
    <Form {...state.form}>
      <form className="space-y-5" onSubmit={state.submit}>
        <AuthFields form={state.form} mode={state.mode} />
        {state.requestErrorCode && (
          <Alert variant="destructive"><AlertTitle>{translate("TXT_AUTH_ERROR_TITLE")}</AlertTitle><AlertDescription>{translate("TXT_AUTH_ERROR_DESCRIPTION")}</AlertDescription></Alert>
        )}
        <Button className="w-full" disabled={state.form.formState.isSubmitting} size="lg" type="submit">
          {translate(state.mode === "login" ? "BTN_LOGIN" : "BTN_REGISTER")}
        </Button>
      </form>
    </Form>
  );
}
