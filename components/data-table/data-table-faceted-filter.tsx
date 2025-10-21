import { Column } from "@tanstack/react-table";
import { ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TVlaue, OValue> {
  column?: Column<TData, TVlaue>;
  title: string;
  disabled?: boolean;
  options: {
    label: ReactNode;
    value: OValue;
    key: React.Key;
  }[];
}

export function DataTableFacetedFilter<TData, TVlaue, OValue>({
  column,
  title,
  disabled,
  options,
}: DataTableFacetedFilterProps<TData, TVlaue, OValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as OValue[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button disabled={disabled} variant={"outline"} size={"sm"}>
          {selectedValues.size > 9 && (
            <Badge variant={"secondary"} size={"lg"}>
              {selectedValues.size}
            </Badge>
          )}
          {title}
          <ChevronDownIcon className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.key}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }

                      const filterValues = [...selectedValues];
                      column?.setFilterValue(
                        filterValues.length > 0 ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-3 justify-center items-end rounded-[4px] border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary-foreground"
                          : "border-input"
                      )}
                    >
                      <CheckIcon className="text-primary-foreground size-3.5" />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="text-muted-foreground ml-auto size-4 flex items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => column?.setFilterValue(undefined)}
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
