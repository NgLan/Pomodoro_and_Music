import type { ImportState, ImportPreviewProps } from "../types/import-ui.types";
import { ImportError } from "./ImportError";
import { ImportPreview } from "./ImportPreview";
import { ImportConfirmation } from "./ImportConfirmation";

type SelectionProps = {
  state: ImportState;
  preview: ImportPreviewProps["preview"];
};
export function ImportSelection({ state, preview }: SelectionProps) {
  const { importer } = state;
  const confirmProps = {
    count: state.selected.size,
    name: state.name,
    isPending: importer.isPending,
    onName: state.setName,
    onImport: () => importer.mutate(),
  };
  return (
    <div className="space-y-5">
      {importer.isError && <ImportFailure state={state} />}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ImportPreview preview={preview} {...previewBindings(state)} />
        <ImportConfirmation {...confirmProps} />
      </div>
    </div>
  );
}

function ImportFailure({ state }: { state: ImportState }) {
  const disabled =
    !state.selected.size || !state.name.trim() || state.importer.isPending;
  return (
    <ImportError
      error={state.importer.error}
      onRetry={() => state.importer.mutate()}
      disabled={disabled}
    />
  );
}

function previewBindings(state: ImportState) {
  return {
    selected: state.selected,
    disabled: state.importer.isPending,
    onSelect: state.setSelected,
  };
}
