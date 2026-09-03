"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  createYoutubeUrlSchema,
  type YoutubeUrlValues,
} from "../schemas/youtube-url.schema";
import { useYoutubeSearch } from "../hooks/use-youtube-search";
import { ResolvedVideoPreview } from "./ResolvedVideoPreview";
import { YoutubeUrlForm } from "./YoutubeUrlForm";

export function AddVideoUrlDialog({
  isOpen,
  onAdd,
  onOpenChange,
}: {
  isOpen: boolean;
  onAdd: (videoId: string) => Promise<unknown>;
  onOpenChange: (open: boolean) => void;
}) {
  const translate = useTranslations("playlist");
  const youtube = useYoutubeSearch();
  const schema = useMemo(
    () => createYoutubeUrlSchema(translate("MSG_URL_INVALID")),
    [translate],
  );
  const form = useForm<YoutubeUrlValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
  });
  const close = () => {
    form.reset();
    youtube.resolve.reset();
    onOpenChange(false);
  };
  const add = async () => {
    if (!youtube.resolve.data) return;
    await onAdd(youtube.resolve.data.externalMediaId);
    close();
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpenChange(true) : close())}
    >
      <DialogContent closeLabel={translate("ARIA_CLOSE")}>
        <DialogHeader>
          <span className="bg-surface-blue border-border grid size-11 place-items-center rounded-xl border-2">
            <Link2 />
          </span>
          <DialogTitle>{translate("TXT_ADD_URL_TITLE")}</DialogTitle>
          <DialogDescription>
            {translate("TXT_ADD_URL_DESCRIPTION")}
          </DialogDescription>
        </DialogHeader>
        {!youtube.resolve.data && (
          <YoutubeUrlForm
            form={form}
            isPending={youtube.resolve.isPending}
            onSubmit={({ url }) => youtube.resolve.mutate(url)}
          />
        )}
        {youtube.resolve.isError && (
          <p className="text-destructive text-sm" role="alert">
            {translate("TXT_URL_RESOLVE_ERROR")}
          </p>
        )}
        {youtube.resolve.data && (
          <ResolvedVideoPreview video={youtube.resolve.data} />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={close}>
            {translate("BTN_CANCEL")}
          </Button>
          <Button disabled={!youtube.resolve.data} onClick={() => void add()}>
            <Plus />
            {translate("BTN_ADD_TO_PLAYLIST")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
