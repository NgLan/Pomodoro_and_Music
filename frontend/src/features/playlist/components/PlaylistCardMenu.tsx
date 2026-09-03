import { Copy, Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function PlaylistCardMenu({
  onDelete,
  onDuplicate,
  onEdit,
}: {
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={translate("ARIA_PLAYLIST_MENU")}
          size="icon-sm"
          variant="ghost"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-border shadow-neo border-2"
      >
        <DropdownMenuItem onSelect={onEdit}>
          <Edit3 />
          {translate("BTN_EDIT")}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDuplicate}>
          <Copy />
          {translate("BTN_DUPLICATE")}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2 />
          {translate("BTN_DELETE")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
