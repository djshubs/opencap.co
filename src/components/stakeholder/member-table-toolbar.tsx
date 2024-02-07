import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "../ui/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "../ui/data-table/data-table-view-options";
import { accessValues, statusValues } from "./data";
import { useDataTable } from "../ui/data-table/data-table";
import { ResetButton } from "../ui/data-table/data-table-buttons";

export function MemberTableToolbar() {
  const { table } = useDataTable();
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="w-64"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statusValues}
          />
        )}
        {table.getColumn("access") && (
          <DataTableFacetedFilter
            column={table.getColumn("access")}
            title="Access"
            options={accessValues}
          />
        )}
        {isFiltered && (
          <ResetButton onClick={() => table.resetColumnFilters()} />
        )}
      </div>
      <DataTableViewOptions />
    </div>
  );
}
