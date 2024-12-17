/**
 * 主题前缀
 */
export const Prefix = "meme";
export const IconPrefix = Prefix + "-icon";

export enum model {
  pro = "black-forest-labs/flux-1.1-pro",
  schnell = "black-forest-labs/flux-schnell",
  dev = "black-forest-labs/flux-dev",
  upscaler = "philz1337x/clarity-upscaler",
  general = "lucataco/flux-dev-lora",
  freeSchnell = "siliconflow/flux-schnell",
  photoGraphy = "vizyai/product-photography",
}

export enum loras {
  wukong = "https://huggingface.co/wanghaofan/Black-Myth-Wukong-FLUX-LoRA/resolve/main/pytorch_lora_weights.safetensors",
  alvdansen = "https://huggingface.co/alvdansen/flux-koda/resolve/main/araminta_k_flux_koda.safetensors",
  AWPortrait = "https://huggingface.co/prithivMLmods/Canopus-LoRA-Flux-FaceRealism/resolve/main/Canopus-LoRA-Flux-FaceRealism.safetensors",
  Boreal = "https://huggingface.co/kudzueye/Boreal/blob/main/boreal-flux-dev-lora-v04_1000_steps.safetensors",
  Tarot = "https://huggingface.co/multimodalart/flux-tarot-v1/blob/main/flux_tarot_v1_lora.safetensors",
  Anime = "https://huggingface.co/brushpenbob/flux-midjourney-anime/blob/main/FLUX_MidJourney_Anime.safetensors",
  Logo = "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Logo-Design/blob/main/FLUX-dev-lora-Logo-Design.safetensors",
  Sketch = "https://huggingface.co/Shakker-Labs/FLUX.1-dev-LoRA-Children-Simple-Sketch/blob/main/FLUX-dev-lora-children-simple-sketch.safetensors",
  Comic = "https://huggingface.co/renderartist/retrocomicflux/blob/main/Retro_Comic_Flux_v1_renderartist.safetensors",
  Illustration = "https://huggingface.co/aleksa-codes/flux-ghibsky-illustration/blob/main/lora.safetensors",
  Cyberpunk = "https://huggingface.co/fofr/flux-80s-cyberpunk/blob/main/lora.safetensors",
  Half_Illustration = "https://huggingface.co/davisbro/half_illustration/blob/main/flux_train_replicate.safetensors",
  Retro_Futurism = "https://huggingface.co/martintomov/retrofuturism-flux/blob/main/retrofuturism_flux_lora_martintomov_v1.safetensors",
  The_Point = "https://huggingface.co/alvdansen/the-point-flux/blob/main/thepoint_flux_araminta_k.safetensors",
}

export const loraTriggerWords = {
  [loras.wukong]: "in the style of wukong",
  [loras.alvdansen]: "in flmft style",
  [loras.AWPortrait]: "in the style offace realism",
  [loras.Boreal]: "in photo style",
  [loras.Tarot]: "in the style of TOK a trtcrd tarot style",
  [loras.Anime]: "in egmid style",
  [loras.Logo]: "wablogo, logo, Minimalist",
  [loras.Sketch]: "in sketched style",
  [loras.Comic]: "in comic book panel style",
  [loras.Illustration]: "in GHIBSKY style",
  [loras.Cyberpunk]: "in 80s cyberpunk style",
  [loras.Half_Illustration]: "in the style of TOK",
  [loras.Retro_Futurism]: "in retrofuturism style",
  [loras.The_Point]: "in pnt style",
};

export const LoraConfig = {
  [loras.wukong]: {
    name: "BlackMythWukong Lora",
    styleName: "WuKong Style",
  },
  [loras.alvdansen]: {
    name: "Koda Lora",
    styleName: "Koda Style",
  },
  [loras.AWPortrait]: {
    name: "Portrait Lora",
    styleName: "Portrait Style",
  },
  [loras.Boreal]: {
    name: "Boring Reality",
    styleName: "Boring Reality Style",
  },
  [loras.Tarot]: {
    name: "Tarot Card",
    styleName: "Tarot Card Style",
  },
  [loras.Anime]: {
    name: "Anime",
    styleName: "Anime Style",
  },
  [loras.Logo]: {
    name: "Logo Design",
    styleName: "Logo Design Style",
  },
  [loras.Sketch]: {
    name: "Children Sketch",
    styleName: "Children Sketch Style",
  },
  [loras.Comic]: {
    name: "Retro Comic",
    styleName: "Retro Comic Style",
  },
  [loras.Illustration]: {
    name: "Illustration",
    styleName: "Illustration Style",
  },
  [loras.Cyberpunk]: {
    name: "Cyberpunk",
    styleName: "Cyberpunk Style",
  },
  [loras.Half_Illustration]: {
    name: "Half Illustration",
    styleName: "Half Illustration Style",
  },
  [loras.Retro_Futurism]: {
    name: "Retro Futurism",
    styleName: "Retro Futurism Style",
  },
  [loras.The_Point]: {
    name: "Soft Retro",
    styleName: "Soft Retro Style",
  },
};

export const Credits = {
  [model.pro]: 10,
  [model.schnell]: 1,
  [model.dev]: 5,
  [model.upscaler]: 10,
  [model.general]: 8,
  [model.freeSchnell]: 0,
  [model.photoGraphy]: 20,
};

export const TextToImageModelName = {
  [model.pro]: "FLUX.1.1 [pro]",
  [model.schnell]: "FLUX.1 [schnell]",
  [model.general]: "FLUX.1 General",
  [model.freeSchnell]: "FLUX.1 [schnell]",
  [model.photoGraphy]: "FLUX.1 [photoGraphy]",
};

export const ImageToImageModelName = {
  [model.dev]: "FLUX.1 [dev]",
  [model.upscaler]: "Clarity Upscaler v1.0",
};

export const ModelName = { ...ImageToImageModelName, ...TextToImageModelName };

export enum Ratio {
  r1 = "1:1",
  r2 = "16:9",
  r3 = "9:16",
  r4 = "3:2",
  r5 = "2:3",
  r6 = "1:2",
  r7 = "3:4",
}

export const ModelDefaultAdVancedSetting = {
  [model.pro]: {
    steps: {
      default: 25,
      min: 1,
      max: 50,
    },
    guidance: {
      default: 3,
      min: 2,
      max: 5,
    },
    interval: {
      default: 2,
      min: 1,
      max: 4,
    },
    safety_tolerance: {
      default: 2,
      min: 1,
      max: 5,
    },
  },
  [model.schnell]: "FLUX.1 [schnell]",
  [model.dev]: "FLUX.1 [dev]",
  [model.upscaler]: "Clarity Upscaler v1.0",
  [model.photoGraphy]: "FLUX.1 [photoGraphy]",
};
