import { useState, type FormEvent } from "react";
import { playlistUrlSchema } from "../schemas/playlist-url.schema";
import type { ImportUrlFormProps } from "../types/import-ui.types";

export function useImportUrlForm({ disabled, onPreview }: ImportUrlFormProps) {
  const [url, setUrl] = useState("");
  const [invalid, setInvalid] = useState(false);
  const onChange = (value: string) => {
    setUrl(value);
    setInvalid(false);
  };
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = playlistUrlSchema.safeParse(url);
    setInvalid(!parsed.success);
    if (parsed.success && !disabled) onPreview(parsed.data);
  };
  return { url, invalid, onChange, onSubmit };
}
