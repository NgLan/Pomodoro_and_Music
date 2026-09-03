import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import type { YoutubeUrlValues } from "../schemas/youtube-url.schema";

export function YoutubeUrlForm({
  form,
  isPending,
  onSubmit,
}: {
  form: UseFormReturn<YoutubeUrlValues>;
  isPending: boolean;
  onSubmit: (values: YoutubeUrlValues) => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translate("VIDEO_URL_LABEL")}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  inputMode="url"
                  placeholder={translate("VIDEO_URL_PLACEHOLDER")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending && <LoaderCircle className="animate-spin" />}
          {translate("BTN_PREVIEW_VIDEO")}
        </Button>
      </form>
    </Form>
  );
}
