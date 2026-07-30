type SelectOption = {
  readonly label: string;
  readonly value: string;
};

interface ManagementControlsProps {
  readonly active: string;
  readonly deleted: string;
  readonly direction: string;
  readonly pageName: string;
  readonly prefix: string;
  readonly search: string;
  readonly searchPlaceholder?: string;
  readonly sort: string;
  readonly sortOptions: readonly SelectOption[];
}

const activeOptions: readonly SelectOption[] = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const deletedOptions: readonly SelectOption[] = [
  { label: "Current", value: "not-deleted" },
  { label: "Deleted", value: "deleted" },
  { label: "All records", value: "all" },
];

export function ManagementControls({
  active,
  deleted,
  direction,
  pageName,
  prefix,
  search,
  searchPlaceholder = "Search by name or slug",
  sort,
  sortOptions,
}: ManagementControlsProps) {
  const fieldName = (name: string) => (prefix ? `${prefix}_${name}` : name);

  return (
    <form className="grid gap-3 md:grid-cols-[minmax(12rem,1fr)_repeat(4,minmax(9rem,auto))]">
      <input name={fieldName("page")} type="hidden" value="1" />
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">{pageName} search</span>
        <input
          className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
          defaultValue={search}
          name={fieldName("search")}
          placeholder={searchPlaceholder}
          type="search"
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Status</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
          defaultValue={active}
          name={fieldName("active")}
        >
          {activeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Records</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
          defaultValue={deleted}
          name={fieldName("deleted")}
        >
          {deletedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Sort</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
          defaultValue={sort}
          name={fieldName("sort")}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-muted-foreground">Direction</span>
        <select
          className="border-border bg-background min-h-11 rounded-sm border px-3 text-sm"
          defaultValue={direction}
          name={fieldName("direction")}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
      <button
        className="bg-primary text-primary-foreground min-h-11 rounded-sm px-4 text-sm font-medium md:col-start-5"
        type="submit"
      >
        Apply
      </button>
    </form>
  );
}
