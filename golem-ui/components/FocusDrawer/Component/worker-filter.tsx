"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup } from "@/components/ui/toggle-group";
import {
  Component,
  SortValues,
  StringComparison,
  WorkerStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Accordion } from "@radix-ui/react-accordion";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { format } from "date-fns";
import {
  ArrowDownZA,
  ArrowUpZA,
  CalendarIcon,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { FC, useState } from "react";
import { SelectRangeEventHandler } from "react-day-picker";
import { useWorkerSearchContext } from "./search-provider";

type DrawerProps = {
  itemId: string;
  componentVersions?: Component[];
};

export const WorkerFilter: FC<DrawerProps> = ({ componentVersions }) => {
  const {
    setSortBy,
    sortBy,
    isDescOrder,
    setDescOrder,
    nameComparison,
    statuses,
    version,
    versionComparison,
    dateRange,
    setFields,
  } = useWorkerSearchContext();
  const setDate: SelectRangeEventHandler = (dateRange) => {
    if (!dateRange) return;
    setFields({ dateRange });
  };
  const [open, setOpen] = useState(false);

  const CommandInlineButtons = () => {
    return (
      <ToggleGroup type="single" className="flex gap-2">
        <ToggleGroupItem className="w-8" value=">=">
          {">="}
        </ToggleGroupItem>
        <ToggleGroupItem className="w-8" value="=">
          {"="}
        </ToggleGroupItem>
        <ToggleGroupItem className="w-8" value="<=">
          {"<="}
        </ToggleGroupItem>
      </ToggleGroup>
    );
  };

  const AccordionIcon = open ? Minus : Plus;

  const Badges = () => (
    <>
      {statuses?.map((s) => <Badge key={s}>{s}</Badge>)}
      {version !== undefined ? <Badge>v{version}</Badge> : null}
      {dateRange && dateRange.from && dateRange.to && (
        <Badge>
          {format(dateRange?.from, "MM/dd/y")}
          {" - "}
          {format(dateRange?.to, "MM/dd/y")}
        </Badge>
      )}
    </>
  );

  return (
    <div className="bg-neutral-100 border-b p-2">
      <Accordion type="multiple" onValueChange={(v) => setOpen(v.length > 0)}>
        <AccordionItem value="filter">
          <div className="flex ">
            <AccordionTrigger
              hideArrow
              className="flex text-xs text-neutral-400 p-2 pb-1 hover:text-[inherit] transition-colors items-center w-full"
            >
              <div className="flex gap-1 overflow-x-hidden items-center w-full">
                <p>Filters</p>
                <AccordionIcon size={12} className="rounded-md" />
                {!open && <Badges />}
              </div>
            </AccordionTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex text-neutral-400 items-center gap-1 px-2 rounded-md p-0.5 mx-0 hover:text-card-foreground">
                <p className="text-xs inline-flex gap-1">
                  {"Sort By"}{sortBy? `: ${sortBy[0].toUpperCase()+sortBy.slice(1)}`: ""}
                  <ChevronDown className="w-4 h-4" />
                </p>
                <span className="sr-only">Toggle name filter comparison</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup className="flex border">
                  <DropdownMenuItem
                    onClick={() => setDescOrder(true)}
                    className={cn("flex-1 flex justify-center",
                      isDescOrder ? "bg-accent " : "text-neutral-400"
                    )}
                  >
                    <ArrowDownZA size={12} />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDescOrder(false)}
                    className={cn("flex-1 flex justify-center",
                      !isDescOrder ? "bg-accent" : "text-neutral-400"
                    )}
                  >
                    <ArrowUpZA size={12} />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {Object.entries(SortValues).map(([key, sort]) => {
                    return (
                      <DropdownMenuItem
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className={cn(sortBy === sort ? "bg-accent" : "text-neutral-400")}
                      >
                        {key}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <AccordionContent className="flex flex-col gap-2 pb-2">
            <div className="pb-0 flex">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 h-9 border border-r-0 px-2 rounded-l-md p-1 mx-0 my-1">
                  {
                    <p className="text-sm text-neutral-400">
                      {nameComparison?.toString()
                        ? StringComparison[
                            nameComparison as keyof typeof StringComparison
                          ]
                        : StringComparison.like}
                    </p>
                  }
                  <span className="sr-only">Toggle name filter comparison</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    {Object.entries(StringComparison).map((sc) => {
                      return (
                        <DropdownMenuItem
                          key={sc[0]}
                          onClick={() =>
                            setFields({
                              nameComparison:
                                sc[0] as keyof typeof StringComparison,
                            })
                          }
                        >
                          {" "}
                          {sc[1] as string}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative pb-0 rounded-md flex flex-1">
                <Search
                  size={16}
                  className="absolute left-2 top-[0.875rem] h-4 w-4 text-muted-foreground"
                />
                <Input
                  className="bg-card m-1 ml-0 flex h-9 flex-1 rounded-r-md rounded-l-none border border-input px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-7"
                  placeholder="Search"
                  onChange={(e) => setFields({ name: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size={"xs"}
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !statuses?.length && "text-muted-foreground",
                      statuses?.length && "bg-accent text-accent-foreground"
                    )}
                  >
                    Statuses
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" asChild>
                  <Card className="w-auto pb-2">
                    <Command>
                      <CommandList>
                        <CommandInput />
                        <CommandGroup
                          heading={<p className="text-sm">Statuses</p>}
                        >
                          {Object.entries(WorkerStatus).map(([key, status]) => (
                            <CommandItem
                              key={key}
                              onSelect={() => {
                                const currStatuses = statuses ?? [];
                                const newStatuses = currStatuses.includes(
                                  status
                                )
                                  ? currStatuses.filter((s) => s !== status)
                                  : [...currStatuses, status];
                                setFields({ statuses: newStatuses });
                              }}
                              className="flex justify-between"
                              value={status}
                            >
                              {status}
                              {statuses?.includes(status) && <Check />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </Card>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size={"xs"}
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !version && "text-muted-foreground",
                      version && "bg-accent text-accent-foreground"
                    )}
                  >
                    Versions
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" asChild>
                  <Card>
                    <Command>
                      <CommandList>
                        <CommandInput />
                        <CommandGroup
                          heading={
                            <div className="flex items-center justify-between text-sm">
                              Versions
                            </div>
                          }
                        >
                          <CommandItem
                            className="flex justify-between"
                            onSelect={() => {
                              setFields({ version: undefined });
                            }}
                            key={"any"}
                          >
                            Any
                            {!version && <Check />}
                          </CommandItem>
                          {componentVersions &&
                            componentVersions.map((component) => {
                              return (
                                <CommandItem
                                  className="flex justify-between"
                                  onSelect={() => {
                                    setFields({
                                      version:
                                        component.versionedComponentId.version,
                                    });
                                  }}
                                  key={component.versionedComponentId.version}
                                >
                                  {component.versionedComponentId.version}

                                  {version &&
                                    version ===
                                      component.versionedComponentId
                                        .version && <Check />}
                                </CommandItem>
                              );
                            })}
                          <CommandInlineButtons />
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </Card>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size={"xs"}
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground",
                      dateRange && "bg-accent text-accent-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        <>
                          {format(dateRange?.from, "LLL dd, yy")} -{" "}
                          {format(dateRange?.to, "LLL dd, yy")}
                        </>
                      ) : (
                        format(dateRange?.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="bottom" asChild>
                  <Card>
                    <Calendar
                      mode="range"
                      // defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </Card>
                </PopoverContent>
              </Popover>
            </div>
            {(statuses || version || versionComparison || dateRange) && (
              <div className="flex px-2 pt-2 border-t gap-2 flex-wrap">
                <Badges />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
