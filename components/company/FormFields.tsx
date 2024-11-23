/* eslint-disable react/display-name */
import React, { memo } from "react";

import { industries } from "@/app/[locale]/(app)/app/company/constants";
import { FormFieldProps } from "@/app/[locale]/(app)/app/company/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Memoized company name field
export const CompanyNameField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="companyName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Company Name</FormLabel>
          <FormControl>
            <Input
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Enter company name"
              {...field}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);

// Memoized industry field
export const IndustryField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="industry"
      render={({ field }) => {
        console.log({ field: field.value });

        return (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={isDisabled}
            >
              <FormControl>
                <SelectTrigger
                  className={`w-full rounded-lg border px-4 py-2 text-white ${
                    form.formState.errors.companyName
                      ? "border-red-500"
                      : "border-gray-600 bg-gray-700"
                  }`}
                >
                  <SelectValue placeholder="Select an industry">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  ),
);

// Memoized website URL field
export const WebsiteUrlField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="websiteUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Website URL</FormLabel>
          <FormControl>
            <Input
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="https://example.com"
              {...field}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);

// Memoized description field
export const DescriptionField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Brief description of your company..."
              {...field}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);

export const TargetAudienceField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="targetAudience"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Target Audience</FormLabel>
          <FormControl>
            <Textarea
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Describe your ideal customers or target market..."
              {...field}
              disabled={isDisabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);
