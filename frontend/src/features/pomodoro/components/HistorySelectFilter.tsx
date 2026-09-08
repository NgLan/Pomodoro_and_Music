import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface HistorySelectOption {
  label: string;
  value: string;
}

function HistorySelectOptions({ options }: { options: HistorySelectOption[] }) {
  return (
    <SelectContent>
      {options.map((option) => (
        <SelectItem value={option.value} key={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  );
}

export function HistorySelectFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: HistorySelectOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold">
      {label}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <HistorySelectOptions options={options} />
      </Select>
    </label>
  );
}
