import React, { memo } from "react";

import { FormFieldProps } from "@/app/[locale]/(app)/app/product-mockup/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// import { useGetReplicateModels } from "@/hooks/replicateModel/use-get-replicateModels";

// import { useSaveReplicateModel } from "@/hooks/replicateModel/use-save-replicateModel";

import { Checkbox } from "../ui/checkbox";

export const ModelNameField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="model_name"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Model Name</FormLabel>
        <FormControl>
          <Input
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
            placeholder="Enter model name"
            {...field}
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value || ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
));

export const DescriptionField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Description</FormLabel>
        <FormControl>
          <Input
            className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
            placeholder="What this training is about..."
            {...field}
            onChange={(e) => field.onChange(e.target.value)}
            value={field.value || ""}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Briefly describe what you&apos;re training and its purpose
        </p>
      </FormItem>
    )}
  />
));

// export const ModelNameField = memo(
//   ({ control }: FormFieldProps & { models: string[] }) => {
//     const [isCreating, setIsCreating] = useState(false);
//     const [newModelName, setNewModelName] = useState("");
//     const user = useUser();

//     const { saveModelData, isSaving } = useSaveReplicateModel(() => {
//       setIsCreating(false);
//       setNewModelName("");
//     });

//     const { models: replicateModels, isLoading: isLoadingModels } =
//       useGetReplicateModels();

//     return (
//       <FormField
//         control={control}
//         name="model_name"
//         render={({ field }) => {
//           const handleCreateModel = () => {
//             if (newModelName.trim()) {
//               saveModelData({
//                 name: newModelName,
//                 username: user?.user?.fullName ?? "",
//               });
//             }
//           };

//           const handleCancel = () => {
//             setIsCreating(false);
//             setNewModelName("");
//           };

//           return (
//             <FormItem>
//               <FormLabel className="text-white">Destination</FormLabel>
//               <FormControl>
//                 {isCreating ? (
//                   <div className="space-y-2">
//                     <Input
//                       className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
//                       placeholder="Enter new model name"
//                       value={newModelName}
//                       onChange={(e) => setNewModelName(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") handleCreateModel();
//                         if (e.key === "Escape") handleCancel();
//                       }}
//                     />
//                     <div className="flex gap-2">
//                       <button
//                         className="flex-1 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
//                         onClick={handleCancel}
//                         disabled={isSaving}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         className="flex-1 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
//                         onClick={handleCreateModel}
//                         disabled={!newModelName.trim() || isSaving}
//                       >
//                         {isSaving ? (
//                           <span className="flex items-center justify-center gap-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Creating...
//                           </span>
//                         ) : (
//                           "Create"
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <Select
//                     onValueChange={(value) => {
//                       if (value === "create-new") {
//                         setIsCreating(true);
//                       } else {
//                         const selectedModel = replicateModels?.find(
//                           (model) => model.name === value,
//                         );
//                         field.onChange({
//                           name: selectedModel?.name,
//                           id: selectedModel?.id,
//                         });
//                       }
//                     }}
//                     value={field.value?.name || ""}
//                   >
//                     <SelectTrigger className="bg-gray-700">
//                       <SelectValue placeholder="Select a model" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem
//                         value="create-new"
//                         onClick={() => setIsCreating(true)}
//                       >
//                         <div className="flex items-center gap-2">
//                           <BadgePlus className="h-5 w-5" /> Create new model
//                         </div>
//                       </SelectItem>
//                       {replicateModels?.map((model) => (
//                         <SelectItem key={model.id} value={model.name}>
//                           {model.name}
//                         </SelectItem>
//                       ))}
//                       {isLoadingModels && (
//                         <SelectItem value="loading" disabled>
//                           <div className="flex items-center gap-2">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             Loading models...
//                           </div>
//                         </SelectItem>
//                       )}
//                     </SelectContent>
//                   </Select>
//                 )}
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           );
//         }}
//       />
//     );
//   },
// );

export const InputImagesField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="input_images"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Images (ZIP file)</FormLabel>
        <FormControl>
          <Input
            type="file"
            accept=".zip"
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
            }}
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    )}
  />
));

export const TriggerWordField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="trigger_word"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Trigger Word</FormLabel>
        <FormControl>
          <Input
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            placeholder="Enter trigger word"
            {...field}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          The trigger word refers to the object, style or concept you are
          training on. Pick a string that isn&apos;t a real word, like TOK or
          something related to what&apos;s being trained, like CYBRPNK. The
          trigger word you specify here will be associated with all images
          during training. Then when you use your LoRA, you can include the
          trigger word in prompts to help activate the LoRA.
        </p>
      </FormItem>
    )}
  />
));

export const AutoCaptionField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="autocaption"
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel>Auto Caption</FormLabel>
          <p className="text-sm text-muted-foreground">
            Automatically caption images using Llava v1.5 13B
          </p>
        </div>
      </FormItem>
    )}
  />
));

export const StepsField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="steps"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Training Steps</FormLabel>
        <FormControl>
          <Input
            type="number"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            min={3}
            max={6000}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Number of training steps. Recommended range: 500-4000. (Min: 3, Max:
          6000)
        </p>
      </FormItem>
    )}
  />
));

export const LoRARankField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="lora_rank"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">LoRA Rank</FormLabel>
        <FormControl>
          <Input
            type="number"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            min={4}
            max={128}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Higher ranks take longer to train but can capture more complex
          features. Caption quality is more important for higher ranks.
        </p>
      </FormItem>
    )}
  />
));

export const LearningRateField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="learning_rate"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Learning Rate</FormLabel>
        <FormControl>
          <Input
            type="number"
            step="0.0001"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            {...field}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Learning rate, if you&apos;re new to training you probably don&apos;t
          need to change this.
        </p>
      </FormItem>
    )}
  />
));

export const BatchSizeField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="batch_size"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Batch Size</FormLabel>
        <FormControl>
          <Input
            type="number"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Batch size, you can leave this as 1
        </p>
      </FormItem>
    )}
  />
));

export const WandbProjectField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="wandb_project"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Weights & Biases Project</FormLabel>
        <FormControl>
          <Input
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            placeholder="Enter project name"
            {...field}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Weights and Biases project name. Only applicable if wandb_api_key is
          set.
        </p>
      </FormItem>
    )}
  />
));

export const ResolutionField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="resolution"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Resolution</FormLabel>
        <FormControl>
          <Input
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            placeholder="512,768,1024"
            {...field}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Image resolutions for training
        </p>
      </FormItem>
    )}
  />
));

export const CaptionDropoutRateField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="caption_dropout_rate"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Caption Dropout Rate</FormLabel>
        <FormControl>
          <Input
            type="number"
            step="0.01"
            min="0"
            max="1"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            {...field}
            onChange={(e) => field.onChange(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Advanced setting. Determines how often a caption is ignored. 0.05
          means for 5% of all steps an image will be used without its caption. 0
          means always use captions, while 1 means never use them. Dropping
          captions helps capture more details of an image, and can prevent
          over-fitting words with specific image elements. Try higher values
          when training a style.
        </p>
      </FormItem>
    )}
  />
));

export const OptimizerField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="optimizer"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Optimizer</FormLabel>
        <FormControl>
          <Input
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            placeholder="Enter Optimizer"
            {...field}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Optimizer to use for training. Supports: prodigy, adam8bit, adamw8bit,
          lion8bit, adam, adamw, lion, adagrad, adafactor.
        </p>
      </FormItem>
    )}
  />
));

export const CacheLatentsField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="cache_latents_to_disk"
    render={({ field }) => (
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel className="text-white">Cache Latents to Disk</FormLabel>
          <p className="text-sm text-muted-foreground">
            Use this if you have lots of input images and you hit out of memory
            errors
          </p>
        </div>
      </FormItem>
    )}
  />
));

export const WandbSampleIntervalField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="wandb_sample_interval"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Sample Interval</FormLabel>
        <FormControl>
          <Input
            type="number"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Step interval for sampling output images that are logged to W&B. Only
          applicable if wandb_api_key is set.
        </p>
      </FormItem>
    )}
  />
));

export const WandbSaveIntervalField = memo(({ control }: FormFieldProps) => (
  <FormField
    control={control}
    name="wandb_save_interval"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-white">Save Interval</FormLabel>
        <FormControl>
          <Input
            type="number"
            className={`w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white`}
            {...field}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
          />
        </FormControl>
        <FormMessage />
        <p className="text-sm text-muted-foreground">
          Step interval for saving intermediate LoRA weights to W&B. Only
          applicable if wandb_api_key is set.
        </p>
      </FormItem>
    )}
  />
));

ModelNameField.displayName = "ModelNameField";
DescriptionField.displayName = "DescriptionField";
InputImagesField.displayName = "InputImagesField";
TriggerWordField.displayName = "TriggerWordField";
AutoCaptionField.displayName = "AutoCaptionField";
StepsField.displayName = "StepsField";
LoRARankField.displayName = "LoRARankField";
LearningRateField.displayName = "LearningRateField";
BatchSizeField.displayName = "BatchSizeField";
WandbProjectField.displayName = "WandbProjectField";
ResolutionField.displayName = "ResolutionField";
CaptionDropoutRateField.displayName = "CaptionDropoutRateField";
OptimizerField.displayName = "OptimizerField";
CacheLatentsField.displayName = "CacheLatentsField";
WandbSampleIntervalField.displayName = "WandbSampleIntervalField";
WandbSaveIntervalField.displayName = "WandbSaveIntervalField";
