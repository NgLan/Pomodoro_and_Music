"use client";

import { CirclePlay, LoaderCircle, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { MediaItemResponseDto } from "@/api";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { useYoutubeSearch } from "../hooks/use-youtube-search";
import { YoutubeSearchResults } from "./YoutubeSearchResults";

export function YoutubeSearchSheet({
  isOpen,
  onAdd,
  onOpenChange,
}: {
  isOpen: boolean;
  onAdd: (videoId: string) => Promise<unknown>;
  onOpenChange: (open: boolean) => void;
}) {
  const translate = useTranslations("playlist");
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const youtube = useYoutubeSearch();
  const search = () => query.trim() && youtube.search.mutate(query.trim());
  const add = async (video: MediaItemResponseDto) => {
    setAddingId(video.externalMediaId);
    try {
      await onAdd(video.externalMediaId);
    } finally {
      setAddingId(null);
    }
  };
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        closeLabel={translate("ARIA_CLOSE")}
        className="w-full overflow-y-auto sm:max-w-2xl"
      >
        <SheetHeader className="border-border border-b-3 p-6">
          <span className="bg-accent-pink border-border grid size-11 place-items-center rounded-xl border-2 text-white">
            <CirclePlay />
          </span>
          <SheetTitle className="text-2xl">
            {translate("TXT_SEARCH_YOUTUBE_TITLE")}
          </SheetTitle>
          <SheetDescription>
            {translate("TXT_SEARCH_YOUTUBE_DESCRIPTION")}
          </SheetDescription>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              search();
            }}
          >
            <Input
              aria-label={translate("SEARCH_YOUTUBE_LABEL")}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={translate("SEARCH_YOUTUBE_PLACEHOLDER")}
              value={query}
            />
            <Button
              disabled={!query.trim() || youtube.search.isPending}
              type="submit"
            >
              {youtube.search.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Search />
              )}
              {translate("BTN_SEARCH")}
            </Button>
          </form>
        </SheetHeader>
        <div className="space-y-3 p-6">
          <YoutubeSearchResults
            addingId={addingId}
            isError={youtube.search.isError}
            isPending={youtube.search.isPending}
            isSuccess={youtube.search.isSuccess}
            onAdd={(video) => void add(video)}
            onRetry={search}
            results={youtube.results}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
