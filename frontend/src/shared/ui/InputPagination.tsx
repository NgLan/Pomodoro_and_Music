"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import {
  InputPaginationField,
  type InputPaginationFieldProps,
} from "@/shared/ui/InputPaginationField";

type InputPaginationProps = InputPaginationFieldProps;
type PaginationControlsProps = InputPaginationProps & {
  nextLabel: string;
  paginationLabel: string;
  previousLabel: string;
};

function PageButton({
  children,
  isDisabled,
  label,
  onClick,
}: {
  children: ReactNode;
  isDisabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      disabled={isDisabled}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function PreviousPageButton(props: PaginationControlsProps) {
  return (
    <PageButton
      isDisabled={Boolean(props.isDisabled) || props.currentPage <= 1}
      label={props.previousLabel}
      onClick={() => props.onPageChange(props.currentPage - 1)}
    >
      <ChevronLeft />
    </PageButton>
  );
}

function NextPageButton(props: PaginationControlsProps) {
  return (
    <PageButton
      isDisabled={
        Boolean(props.isDisabled) || props.currentPage >= props.totalPages
      }
      label={props.nextLabel}
      onClick={() => props.onPageChange(props.currentPage + 1)}
    >
      <ChevronRight />
    </PageButton>
  );
}

function PaginationControls(props: PaginationControlsProps) {
  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label={props.paginationLabel}
    >
      <PreviousPageButton {...props} />
      <InputPaginationField {...props} />
      <NextPageButton {...props} />
    </nav>
  );
}

/** Renders compact previous/next navigation with a directly editable page. */
export function InputPagination(props: InputPaginationProps) {
  const translate = useTranslations("common");
  if (props.totalPages < 1) return null;
  return (
    <PaginationControls
      {...props}
      paginationLabel={translate("ARIA_PAGINATION")}
      previousLabel={translate("ARIA_PREVIOUS_PAGE")}
      nextLabel={translate("ARIA_NEXT_PAGE")}
    />
  );
}
