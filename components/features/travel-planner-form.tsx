"use client";

import { useState } from "react";

import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDays, format } from "date-fns";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { CalendarIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { formSchema } from "@/server/schema";
import { generateTripItinerary } from "@/server/ai";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";



const activities = [
  {
    value: "food",
    label: "Food",
  },
  {
    value: "hiking",
    label: "Hiking",
  },
  {
    value: "nature",
    label: "Nature",
  },
  {
    value: "culture",
    label: "Culture",
  },
  {
    value: "history",
    label: "History",
  },
  {
    value: "art",
    label: "Art",
  },
];

export default function TravelPlannerForm() {
  const router = useRouter();

  const [currentlySelectedActivities, setCurrentlySelectedActivities] =
    useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const planId = await generateTripItinerary(values);
      router.push(`/plan/${planId}`);
    } catch (error) {
      console.error(error);
    }
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        form.setValue(
                          "endDate",
                          addDays(date ?? new Date(), 1)
                        );
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date you leave for your trip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ?? addDays(form.getValues("startDate"), 1)
                      }
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() ||
                        date < addDays(form.getValues("startDate"), 1)
                      }
                      initialFocus
                      defaultMonth={form.getValues("endDate")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The date you return from your trip.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    field.onChange(Number(e.target.value));
                  }}
                  placeholder="Enter your budget"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                The total amount of money you want to spend on your trip. In USD Dollars
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activities"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Activities</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      Selected Activities
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search Activity..." />
                    <CommandList>
                      <CommandEmpty>No Activity found.</CommandEmpty>
                      <CommandGroup>
                        {activities.map((activity) => (
                          <CommandItem
                            value={activity.label}
                            key={activity.value}
                            onSelect={() => {
                              if (
                                currentlySelectedActivities.includes(
                                  activity.label
                                )
                              ) {
                                setCurrentlySelectedActivities(
                                  currentlySelectedActivities.filter(
                                    (a) => a !== activity.label
                                  )
                                );

                                form.setValue(
                                  "activities",
                                  currentlySelectedActivities.filter(
                                    (a) => a !== activity.label
                                  )
                                );
                              } else {
                                setCurrentlySelectedActivities([
                                  ...currentlySelectedActivities,
                                  activity.label,
                                ]);

                                form.setValue("activities", [
                                  ...currentlySelectedActivities,
                                  activity.label,
                                ]);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentlySelectedActivities.includes(
                                  activity.label
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {activity.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                These are the activities you want to do on your trip.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination - Optional</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your destination" />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This is the destination of your trip.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </>
          ) : (
            "Submit"
          )}</Button>
          <Link href={"./"}>
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}
