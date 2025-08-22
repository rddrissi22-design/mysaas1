"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { api } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

interface OrganizationSwitcherProps {
  currentOrgSlug?: string;
}

export function OrganizationSwitcher({ currentOrgSlug }: OrganizationSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  const { data: memberships } = api.organizations.getUserOrganizations.useQuery();
  
  const currentOrg = memberships?.find(m => m.org.slug === currentOrgSlug)?.org;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentOrg ? currentOrg.name : "Select organization..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {memberships?.map((membership) => (
                <CommandItem
                  key={membership.org.id}
                  value={membership.org.slug}
                  onSelect={(value) => {
                    router.push(`/dashboard/${value}`);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentOrgSlug === membership.org.slug ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {membership.org.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  router.push("/dashboard/new");
                  setOpen(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}