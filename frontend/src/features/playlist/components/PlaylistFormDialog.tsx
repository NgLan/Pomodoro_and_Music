"use client";

import { LoaderCircle, Music2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PlaylistMetadataRequestDto } from "@/api";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Form } from "@/shared/ui/form";
import { usePlaylistForm } from "../hooks/use-playlist-form";
import type { PlaylistDialogState } from "../types/playlist-ui.types";
import { PlaylistFormFields } from "./PlaylistFormFields";

export function PlaylistFormDialog({
  state,
  onClose,
  onSubmit,
}: {
  state: PlaylistDialogState;
  onClose: () => void;
  onSubmit: (body: PlaylistMetadataRequestDto, id?: string) => Promise<unknown>;
}) {
  const translate = useTranslations("playlist");
  const playlist = state?.playlist ?? null;
  const { form, submit } = usePlaylistForm(
    playlist,
    Boolean(state),
    async (body) => {
      await onSubmit(body, playlist?.id);
      onClose();
    },
  );
  return (
    <Dialog open={Boolean(state)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeLabel={translate("ARIA_CLOSE")}
        className="sm:max-w-xl"
      >
        <DialogHeader>
          <div className="bg-secondary border-border mb-2 grid size-11 place-items-center rounded-xl border-2">
            <Music2 />
          </div>
          <DialogTitle>
            {translate(playlist ? "TXT_EDIT_PLAYLIST" : "TXT_CREATE_PLAYLIST")}
          </DialogTitle>
          <DialogDescription>
            {translate("TXT_FORM_DESCRIPTION")}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="grid gap-6" onSubmit={submit}>
            <PlaylistFormFields form={form} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {translate("BTN_CANCEL")}
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {form.formState.isSubmitting && (
                  <LoaderCircle className="animate-spin" />
                )}
                {translate(playlist ? "BTN_SAVE" : "BTN_CREATE")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
