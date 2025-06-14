"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import type { CategoryType } from "../../types";

// const items = [
//   {
//     id: "recents",
//     label: "Recents",
//   },
//   {
//     id: "home",
//     label: "Home",
//   },
//   {
//     id: "applications",
//     label: "Applications",
//   },
//   {
//     id: "desktop",
//     label: "Desktop",
//   },
//   {
//     id: "downloads",
//     label: "Downloads",
//   },
//   {
//     id: "documents",
//     label: "Documents",
//   },
// ] as const;

const FormSchema = z.object({
  categories: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   message: "You have to select at least one category.",
  // }),
  types: z.array(z.string()),
  // .refine((value) => value.some((item) => item), {
  //   //some =array must contain at least one string that is not empty, null, undefined, etc.?"
  //   message: "You have to select at least one type.",
  // }),
});

interface FilterProps {
  categories: CategoryType[];
  types: CategoryType[];
}
interface ProductsFilterProps {
  filterList: FilterProps;
  selectedCategories: string[];
  selectedTypes: string[];
  onFilterChange: (categories: string[], types: string[]) => void;
}
export default function ProductFilter({
  filterList,
  selectedCategories,
  selectedTypes,
  onFilterChange,
}: ProductsFilterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: selectedCategories,
      types: selectedTypes,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    onFilterChange(data.categories, data.types);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furniture Made By</FormLabel>
              </div>
              {filterList.categories.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="categories"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    item.id.toString(),
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id.toString()
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="types"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Furniture Types</FormLabel>
              </div>
              {filterList.types.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="types"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id.toString())}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([
                                    ...field.value,
                                    item.id.toString(),
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id.toString()
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.name}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="outline">
          Filter
        </Button>
      </form>
    </Form>
  );
}
