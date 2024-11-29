/* eslint-disable react/display-name */
import React, { memo } from "react";

import TextareaAutosize from "react-textarea-autosize";

import { FormFieldProps } from "@/app/[locale]/(app)/app/company/types";
import {
  categories,
  currencies,
  frequencies,
} from "@/app/[locale]/(app)/app/products/constants";
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

export const NameField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Enter name"
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

export const PriceField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="price"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Price</FormLabel>
          <FormControl>
            <Input
              className={`w-full rounded-lg border px-4 py-2 text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Enter Amount"
              {...field}
              disabled={isDisabled}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal point
                field.onChange(value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);

export const CategoryField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="category"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Category</FormLabel>
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
                  <SelectValue placeholder="Select an category">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((categoty) => (
                  <SelectItem key={categoty.label} value={categoty.value}>
                    {categoty.label}
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

export const FrequencyField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="frequency"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Frequency</FormLabel>
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
                  <SelectValue placeholder="Select an Frequency">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {frequencies.map((frequency) => (
                  <SelectItem key={frequency.label} value={frequency.value}>
                    {frequency.label}
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

export const CurrencyField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="currency"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Currency</FormLabel>
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
                  <SelectValue placeholder="Select an Currency">
                    {field.value}
                  </SelectValue>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
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

export const DescriptionField = memo(
  ({ control, isDisabled, form }: FormFieldProps) => (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <TextareaAutosize
              className={`w-full resize-none rounded-lg border px-4 py-2 text-sm text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Brief description..."
              {...field}
              disabled={isDisabled}
              minRows={3}
              maxRows={10}
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
            <TextareaAutosize
              className={`w-full resize-none rounded-lg border px-4 py-2 text-sm text-white ${
                form.formState.errors.companyName
                  ? "border-red-500"
                  : "border-gray-600 bg-gray-700"
              }`}
              placeholder="Describe your ideal customers or target market..."
              {...field}
              disabled={isDisabled}
              minRows={3}
              maxRows={10}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  ),
);
