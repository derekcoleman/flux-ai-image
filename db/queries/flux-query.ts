import { FluxHashids } from "@/db/dto/flux.dto";
import { prisma } from "@/db/prisma";

import { FluxSelectDto } from "../type";

function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

// 转换整个对象的键为驼峰命名
function convertKeysToCamelCase(obj: Record<string, any>): Record<string, any> {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = snakeToCamelCase(key);
      newObj[camelKey] = obj[key];
    }
  }
  return newObj;
}

export async function getFluxDataBySeed({ limit = 18 }: { limit?: number }) {
  // const [count] = await db
  //   .select({
  //     count: sql<number>`count(${face.id})`,
  //   })
  //   .from(face)
  //   .execute();
  const data = await prisma.$queryRaw`
    SELECT fd.*, json_agg(fai.image_url) AS image_urls
    FROM flux_data fd
    JOIN flux_ai_images fai ON fd.id = fai.flux_id
    GROUP BY fd.id
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;

  const expandedData = (data as any[]).flatMap((item) =>
    item.image_urls.map((imageUrl: string) => ({
      ...item,
      image_urls: imageUrl,
    })),
  );

  const transformedResults = expandedData
    ? ((expandedData as any[]).map(convertKeysToCamelCase) ?? [])
    : [];
  // const data = await db.execute(sql`SELECT * FROM face_data ORDER BY RANDOM() LIMIT 20;`);

  return {
    data: transformedResults?.map(({ id, imageUrls, ...rest }) => ({
      ...rest,
      imageUrl: `https://img.douni.one/?url=${encodeURIComponent(imageUrls!)}&action=resize!520,520,2|draw_text!s.douni.one/a,10,400`,
      id: FluxHashids.encode(id),
    })) as unknown as Array<FluxSelectDto & { imageUrl: string }>,
  };
}
