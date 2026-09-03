import { ArrowDown, ArrowUp, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

export function TrackMenu({
  isFirst,
  isLast,
  onMove,
  onRemove,
}: {
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const translate = useTranslations("playlist");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={translate("ARIA_TRACK_MENU")}
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
        <DropdownMenuItem disabled={isFirst} onSelect={() => onMove(-1)}>
          <ArrowUp />
          {translate("BTN_MOVE_UP")}
        </DropdownMenuItem>
        <DropdownMenuItem disabled={isLast} onSelect={() => onMove(1)}>
          <ArrowDown />
          {translate("BTN_MOVE_DOWN")}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onRemove}>
          <Trash2 />
          {translate("BTN_REMOVE_TRACK")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
