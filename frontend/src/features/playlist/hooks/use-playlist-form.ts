"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { PlaylistMetadataRequestDto } from "@/api";
import {
  createPlaylistFormSchema,
  type PlaylistFormValues,
} from "../schemas/playlist-form.schema";
import type { PlaylistMetadataDraft } from "../types/playlist-ui.types";

const EMPTY_VALUES: PlaylistFormValues = {
  name: "",
  description: "",
  thumbnailUrl: "",
};

export function usePlaylistForm(
  playlist: PlaylistMetadataDraft | null,
  isOpen: boolean,
  onSubmit: (body: PlaylistMetadataRequestDto) => Promise<unknown>,
) {
  const translate = useTranslations("playlist");
  const schema = useMemo(
    () => createPlaylistFormSchema(translate),
    [translate],
  );
  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_VALUES,
  });
  useEffect(() => {
    if (!isOpen) return;
    form.reset(
      playlist
        ? {
            name: playlist.name,
            description: playlist.description ?? "",
            thumbnailUrl: playlist.thumbnailUrl ?? "",
          }
        : EMPTY_VALUES,
    );
  }, [form, isOpen, playlist]);
  const submit = form.handleSubmit(async (values) =>
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim() || null,
      thumbnailUrl: values.thumbnailUrl.trim() || null,
    }),
  );
  return { form, submit };
}
