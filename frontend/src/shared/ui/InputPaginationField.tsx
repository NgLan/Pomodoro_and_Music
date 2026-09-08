"use client";

import { useTranslations } from "next-intl";
import type { FormEvent, KeyboardEvent } from "react";
import { Input } from "@/shared/ui/input";

export interface InputPaginationFieldProps {
  currentPage: number;
  totalPages: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
}

function submitPage(
  event: FormEvent<HTMLFormElement>,
  props: InputPaginationFieldProps,
) {
  event.preventDefault();
  const input = event.currentTarget.elements.namedItem("page");
  if (!(input instanceof HTMLInputElement)) return;
  const parsedPage = Number(input.value);
  const validPage = Number.isInteger(parsedPage)
    ? parsedPage
    : props.currentPage;
  const nextPage = Math.min(Math.max(validPage, 1), props.totalPages);
  input.value = String(nextPage);
  if (nextPage !== props.currentPage) props.onPageChange(nextPage);
}

function submitOnEnter(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  event.currentTarget.form?.requestSubmit();
}

export function InputPaginationField(props: InputPaginationFieldProps) {
  const translate = useTranslations("common");
  return (
    <form
      className="flex items-center gap-2 font-bold tabular-nums"
      onSubmit={(event) => submitPage(event, props)}
    >
      <Input
        key={props.currentPage}
        className="h-10 w-16 px-1 text-center"
        name="page"
        type="number"
        inputMode="numeric"
        min={1}
        max={props.totalPages}
        defaultValue={props.currentPage}
        disabled={props.isDisabled}
        aria-label={translate("PAGE_NUMBER_LABEL")}
        onKeyDown={submitOnEnter}
      />
      <span aria-hidden="true">/</span>
      <span>{props.totalPages}</span>
    </form>
  );
}
