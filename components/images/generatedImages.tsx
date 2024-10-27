import "react-slideshow-image/dist/styles.css";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Slide } from "react-slideshow-image";

import BlurFade from "../magicui/blur-fade";

interface GeneratedImagesProps {
  fluxData: any;
  delay?: number;
  className: string;
  key: number | string;
}

export default function GeneratedImages({
  fluxData,
  delay,
  className,
  key,
}: GeneratedImagesProps) {
  return (
    <BlurFade inView delay={delay} key={key}>
      {fluxData.imageUrl.length > 1 ? (
        <Slide
          duration={2000}
          easing="ease"
          prevArrow={<ArrowLeft className="text-2xl text-white" />}
          nextArrow={<ArrowRight className="text-2xl text-white" />}
        >
          {fluxData.imageUrl.map((image, index) => (
            <div key={index} className="each-slide">
              <img
                src={image.imageUrl}
                alt="Generated Image"
                className={className}
              />
            </div>
          ))}
        </Slide>
      ) : (
        <img
          src={fluxData.imageUrl[0].imageUrl}
          alt="Generated Image"
          className={className}
        />
      )}
    </BlurFade>
  );
}
