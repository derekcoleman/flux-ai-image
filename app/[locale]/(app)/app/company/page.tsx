"use client";

import React, { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  CompanyNameField,
  DescriptionField,
  IndustryField,
  TargetAudienceField,
  WebsiteUrlField,
} from "@/components/company/FormFields";
import { OptimizedImage } from "@/components/images/optimizedimages";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCompanyInformation } from "@/hooks/CompanyInformation/use-get-companyInformation";
import { useSaveCompanyInformation } from "@/hooks/CompanyInformation/use-save-companyInformation";
import { useUpdateCompanyInformation } from "@/hooks/CompanyInformation/use-update-companyInformation";

import { CompanyInfo, companyInfoSchema, defaultValues } from "./constants";

export default function CompanyInformation() {
  const { data: companyInfo, isLoading } = useGetCompanyInformation();
  const { saveCompanyData, isSaving } = useSaveCompanyInformation();
  const { updateCompanyData, isUpdating } = useUpdateCompanyInformation();
  const [isLogoChanged, setIsLogoChanged] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const form = useForm<CompanyInfo>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    if (companyInfo) {
      form.reset(companyInfo);
      setCompanyLogo(companyInfo?.companyLogo || null);
      setFormKey((prevKey) => prevKey + 1);
    }
  }, [companyInfo, form]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCompanyLogo(reader.result as string);
        setIsLogoChanged(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: CompanyInfo) => {
    const urlPattern = /^https?:\/\//;
    const processedData = {
      ...data,
      websiteUrl: data.websiteUrl
        ? urlPattern.test(data.websiteUrl)
          ? data.websiteUrl
          : `https://${data.websiteUrl}`
        : "",
    };

    if (isEditing) {
      updateCompanyData({ ...processedData, companyLogo: companyLogo });
      setIsEditing(false);
    } else {
      saveCompanyData({ ...processedData, companyLogo: companyLogo });
    }
    setIsLogoChanged(false);
  };

  const handleCancelEdit = () => {
    form.reset(companyInfo || {});
    setIsEditing(false);
    setIsLogoChanged(false);
    setCompanyLogo(companyInfo?.companyLogo || null);
  };

  console.log({ companyInfo });

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Company Information
          </h1>
          <p className="text-gray-400">
            Provide details about your company to enhance AI-generated content
          </p>
        </div>

        <div className="flex flex-col gap-8 p-6 lg:flex-row lg:gap-12">
          <div className="w-full rounded-xl bg-gray-800 p-6">
            <Form {...form}>
              <form
                className="grid w-full gap-6 lg:grid-cols-3"
                onSubmit={form.handleSubmit(onSubmit)}
                key={formKey}
              >
                <div className="order-first flex flex-col items-center gap-2 lg:order-none lg:col-span-1">
                  {isLoading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-32 w-32 rounded-full bg-gray-600" />
                      <Skeleton className="mt-2 h-5 w-24 bg-gray-600" />
                    </div>
                  ) : (
                    <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-gray-600 bg-gray-700">
                      {companyLogo ? (
                        <OptimizedImage src={companyLogo} alt="Company Logo" />
                      ) : (
                        <Upload className="h-8 w-8 text-gray-400" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        onChange={handleLogoUpload}
                        disabled={!isEditing && !!companyInfo}
                      />
                    </div>
                  )}
                  {!isLoading && (
                    <Label className="items-center text-sm text-gray-300">
                      Company Logo
                    </Label>
                  )}
                  {((companyLogo && isEditing) ||
                    (!companyInfo && companyLogo && !isEditing)) && (
                    <button
                      className="mt-2 rounded-lg bg-red-600 px-3 py-1 text-sm font-bold text-white"
                      onClick={() => {
                        setCompanyLogo(null);
                        setIsLogoChanged(true);
                      }}
                    >
                      Remove Logo
                    </button>
                  )}
                </div>

                <div className="grid gap-6 lg:col-span-2">
                  <div className="grid gap-6 md:grid-cols-2">
                    {isLoading ? (
                      <>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-32 rounded-md bg-gray-600" />
                          <Skeleton className="h-10 w-full rounded-md bg-gray-600" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-4 w-32 rounded-md bg-gray-600" />
                          <Skeleton className="h-10 w-full rounded-md bg-gray-600" />
                        </div>
                      </>
                    ) : (
                      <>
                        <CompanyNameField
                          control={form.control}
                          isDisabled={!isEditing && !!companyInfo}
                          form={form}
                        />
                        <WebsiteUrlField
                          control={form.control}
                          isDisabled={!isEditing && !!companyInfo}
                          form={form}
                        />
                      </>
                    )}
                  </div>

                  <div>
                    {isLoading ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-md bg-gray-600" />
                        <Skeleton className="h-24 w-full rounded-md bg-gray-600" />
                      </div>
                    ) : (
                      <DescriptionField
                        control={form.control}
                        isDisabled={!isEditing && !!companyInfo}
                        form={form}
                      />
                    )}
                  </div>

                  <div>
                    {isLoading ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-md bg-gray-600" />
                        <Skeleton className="h-24 w-full rounded-md bg-gray-600" />
                      </div>
                    ) : (
                      <TargetAudienceField
                        control={form.control}
                        isDisabled={!isEditing && !!companyInfo}
                        form={form}
                      />
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {isLoading ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-md bg-gray-600" />
                        <Skeleton className="h-12 w-full rounded-md bg-gray-600" />
                      </div>
                    ) : (
                      <IndustryField
                        control={form.control}
                        isDisabled={!isEditing && !!companyInfo}
                        form={form}
                      />
                    )}
                  </div>

                  <div className="flex justify-end gap-4">
                    {isLoading ? (
                      <Skeleton className="h-10 w-36 rounded-md bg-gray-600" />
                    ) : (
                      <>
                        {!companyInfo && (
                          <Button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                          >
                            {isSaving ? "Saving..." : "Save Information"}
                          </Button>
                        )}
                        {companyInfo && isEditing ? (
                          <>
                            <Button onClick={handleCancelEdit}>Cancel</Button>
                            <Button
                              disabled={
                                isUpdating ||
                                (!form.formState.isDirty && !isLogoChanged)
                              }
                              type="submit"
                              className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                            >
                              Update Changes
                            </Button>
                          </>
                        ) : (
                          companyInfo &&
                          !isEditing && (
                            <Button
                              disabled={isUpdating}
                              onClick={() => setIsEditing(true)}
                              className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                            >
                              {isUpdating ? "Updating..." : " Edit Information"}
                            </Button>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
