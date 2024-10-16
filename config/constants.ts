/**
 * 主题前缀
 */
export const Prefix = "meme";
export const IconPrefix = Prefix + "-icon";

export enum model {
  pro = "black-forest-labs/flux-pro",
  schnell = "black-forest-labs/flux-schnell",
  dev = "black-forest-labs/flux-dev",
  general = "lucataco/flux-dev-lora",
  freeSchnell = "siliconflow/flux-schnell",
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
}

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
};

export const Credits = {
  [model.pro]: 10,
  [model.schnell]: 1,
  [model.dev]: 5,
  [model.general]: 8,
  [model.freeSchnell]: 0,
};

export const ModelName = {
  [model.pro]: "FLUX.1 [pro]",
  [model.schnell]: "FLUX.1 [schnell]",
  [model.dev]: "FLUX.1 [dev]",
  [model.general]: "FLUX.1 General",
  [model.freeSchnell]: "FLUX.1 [schnell]",
};

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
};
