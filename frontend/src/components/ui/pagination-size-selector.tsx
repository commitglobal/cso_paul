import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils.ts"
import { Button } from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form.tsx"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover.tsx"
import { useState } from "react"
import { useTranslation } from "react-i18next";

const pageSizes = [
  {label: "5", value: "5"},
  {label: "10", value: "10"},
  {label: "25", value: "25"},
  {label: "50", value: "50"},
  {label: "All", value: "all"},
] as const

const FormSchema = z.object({
  pageSize: z.string().refine(
    (val) => val === "all" || (!isNaN(Number(val)) && Number(val) > 0),
    {
      message: "Enter a valid number or select 'All'",
    }
  ),
})

type PaginationSizeSelectorProps = {
  value?: string
  onChange: (value: string) => void
}

export function PaginationSizeSelector({value, onChange}: PaginationSizeSelectorProps) {
  const {t} = useTranslation();

  const [inputValue, setInputValue] = useState("")
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {pageSize: value || "10"},
  })

  function handleSelect(val: string) {
    form.setValue("pageSize", val, {shouldValidate: true})
    onChange(val)
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="pageSize"
        render={({field}) => (
          <div className="flex items-center justify-center">
            <FormItem className="flex flex-row-reverse">
              <FormLabel className="text-sm font-normal text-gray-700">
                {t('pagination.sizeSelector.per_page')}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[160px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value === "all"
                        ? "All"
                        : field.value || "Select"}
                      <ChevronsUpDown className="opacity-50"/>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[160px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={t('pagination.sizeSelector.search_placeholder')}
                      className="h-9"
                      value={inputValue}
                      onValueChange={setInputValue}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          if (
                            inputValue &&
                            (inputValue === "all" ||
                              (!isNaN(Number(inputValue)) && Number(inputValue) > 0))
                          ) {
                            form.setValue("pageSize", inputValue, {shouldValidate: true})
                            onChange(inputValue)
                          }
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {t('pagination.sizeSelector.no_results')}
                      </CommandEmpty>
                      <CommandGroup>
                        {pageSizes.map((size) => (
                          <CommandItem
                            value={size.label}
                            key={size.value}
                            onSelect={() => {
                              setInputValue("")
                              handleSelect(size.value)
                            }}
                          >
                            {size.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                size.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage/>
            </FormItem>
          </div>
        )}
      />
    </Form>
  )
}
