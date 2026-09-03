import type { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import type { PlaylistFormValues } from "../schemas/playlist-form.schema";

export function PlaylistFormFields({
  form,
}: {
  form: UseFormReturn<PlaylistFormValues>;
}) {
  const translate = useTranslations("playlist");
  return (
    <div className="grid gap-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translate("PLAYLIST_NAME_LABEL")}</FormLabel>
            <FormControl>
              <Input
                autoFocus
                placeholder={translate("PLAYLIST_NAME_PLACEHOLDER")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translate("DESCRIPTION_LABEL")}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={translate("DESCRIPTION_PLACEHOLDER")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="thumbnailUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{translate("THUMBNAIL_LABEL")}</FormLabel>
            <FormControl>
              <Input
                inputMode="url"
                placeholder={translate("THUMBNAIL_PLACEHOLDER")}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
