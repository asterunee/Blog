import fs from "node:fs";
import path from "node:path";

export type ManagedCategory = {
  slug: string;
  name: string;
  description: string;
  order: number;
  visible: boolean;
  appliesTo: ContentKind[];
};

export type ContentKind = "posts" | "solutions" | "logs";

export type ManagedContentType = {
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
          appliesTo: (Array.isArray(value.appliesTo)
            ? value.appliesTo.filter((kind): kind is ContentKind => kind === "posts" || kind === "solutions" || kind === "logs")
            : ["posts", "solutions", "logs"]) as ContentKind[],
        }];
      } catch {
        return [];
      }
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, "ko"));
}

export function getManagedContentTypes(): ManagedContentType[] {
  const directory = path.join(process.cwd(), "content/content-types");
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      try {
        const value = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")) as Partial<ManagedContentType>;
        if (!value.name) return [];
        return [{
          slug: file.replace(/\.json$/, ""),
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
  if (slug === "uncategorized") return "미분류";
  return getManagedCategories().find((category) => category.slug === slug)?.name || slug;
}

export function getContentTypeName(slug: string) {
  if (slug === "article") return "글";
  return getManagedContentTypes().find((type) => type.slug === slug)?.name || slug;
}
