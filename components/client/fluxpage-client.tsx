import { DownloadAction } from "@/components/history/download-action";
import { LoraConfig, ModelName } from "@/config/constants";
import { cn, formatDate } from "@/lib/utils";

import { CopyButton } from "../shared/copy-button";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

interface FluxPageClientProps {
  flux: any;
  locale: string;
  imageUrlId: string;
  translations: {
    prompt: string;
    executePrompt: string;
    model: string;
    lora: string;
    resolution: string;
    createdAt: string;
  };
}

const FluxPageClient: React.FC<FluxPageClientProps> = ({
  flux,
  imageUrlId,
  translations,
}) => {
  return (
    <div className="w-full bg-background p-4 text-foreground md:w-1/2">
      <ScrollArea className="h-full">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {translations.prompt}
              </h2>
              <p className="text-sm text-muted-foreground">
                {flux.inputPrompt}
                <CopyButton
                  value={flux.inputPrompt!}
                  className={cn("relative ml-2", "duration-250 transition-all")}
                />
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {translations.executePrompt}
              </h2>
              <p className="text-sm text-muted-foreground">
                {flux.executePrompt}
                <CopyButton
                  value={flux.executePrompt!}
                  className={cn("relative ml-2", "duration-250 transition-all")}
                />
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {translations.model}
              </h2>
              <p className="text-sm text-muted-foreground">
                {ModelName[flux.model]}
              </p>
            </div>
            {flux.loraName && (
              <div>
                <h2 className="mb-2 text-lg font-semibold">
                  {translations.lora}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {LoraConfig[flux.loraName]?.styleName}
                </p>
              </div>
            )}
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {translations.resolution}
              </h2>
              <p className="text-sm text-muted-foreground">
                {flux.aspectRatio}
              </p>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {translations.createdAt}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatDate(flux.createdAt!)}
              </p>
            </div>
            <div className="flex flex-row justify-between space-x-2 pt-0">
              <DownloadAction
                showText
                id={flux.id}
                fluxImageIds={[imageUrlId]}
              />
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );
};

export default FluxPageClient;
