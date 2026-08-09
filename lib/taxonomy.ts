import fs from "node:fs";
import path from "node:path";

export type ManagedCategory = {
  slug: string;
  name: string;
  description: string;
  order: number;
  visible: boolean;
};

export function getManagedCategories(): ManagedCategory[] {
  const directory = path.join(process.cwd(), "content/categories");
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      try {
        const value = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")) as Partial<ManagedCategory>;
        const slug = file.replace(/\.json$/, "");
        if (!value.name) return [];
        return [{
          slug,
          name: value.name,
          description: value.description || "",
          order: Number.isFinite(value.order) ? Number(value.order) : 0,
          visible: value.visible !== false,
        }];
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "ko"));
}

export function getCategoryName(slug: string) {
  return getManagedCategories().find((category) => category.slug === slug)?.name || slug;
}
