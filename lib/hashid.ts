import BaseHashIds from "hashids";

import { env } from "@/env.mjs";

export const Hashids = (prefix: string, length = 12) => {
  const salt = `${env.HASHID_SALT}:${prefix}`;
  return new BaseHashIds(salt, length);
};
