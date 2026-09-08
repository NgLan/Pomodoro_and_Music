import { useTranslations } from "next-intl";
import type { UseFormReturn } from "react-hook-form";
import { PlaylistSelector } from "@/features/music-player/components/PlaylistSelector";
import { FormField, FormItem, FormMessage } from "@/shared/ui/form";
import type { ConfigurationFormValues } from "../types/pomodoro-ui.types";

export function ConfigurationMusicFields({
  form,
}: {
  form: UseFormReturn<ConfigurationFormValues>;
}) {
  const t = useTranslations("musicPlayer");
  return (
    <fieldset className="bg-surface-blue border-border space-y-4 rounded-xl border-2 p-4">
      <legend className="px-2 font-bold">{t("TXT_CONFIG_MUSIC")}</legend>
      <p className="text-muted-foreground text-sm">{t("TXT_SHARED_HINT")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <MusicField form={form} name="focusPlaylistId" />
        <MusicField form={form} name="breakPlaylistId" />
      </div>
    </fieldset>
  );
}

interface MusicFieldProps {
  form: UseFormReturn<ConfigurationFormValues>;
  name: "focusPlaylistId" | "breakPlaylistId";
}

function MusicField({ form, name }: MusicFieldProps) {
  const t = useTranslations("musicPlayer");
  const label = t(
    name === "focusPlaylistId"
      ? "FOCUS_PLAYLIST_LABEL"
      : "BREAK_PLAYLIST_LABEL",
  );
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <PlaylistSelector
            value={field.value}
            onChange={field.onChange}
            label={label}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
