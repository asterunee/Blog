import rawEditorSettings from "@/content/settings/editor.json";

export type WriterSection = {
  key: string;
  collectionKey: string;
  builtIn: boolean;
  label: string;
  description: string;
  order: number;
  visible: boolean;
  showInNavigation: boolean;
  showOnHome: boolean;
};

type RawSection = Partial<Omit<WriterSection, "collectionKey" | "builtIn">>;

const builtInKeys = new Set(["posts", "solutions", "logs"]);

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

const raw = rawEditorSettings as { groupLabel?: string; sections?: RawSection[] };

export const editorGroupLabel = raw.groupLabel?.trim() || "콘텐츠 작성";

export const writerSections: WriterSection[] = (Array.isArray(raw.sections) ? raw.sections : [])
  .flatMap((section) => {
    const key = normalizeKey(section.key || "");
    if (!key || !section.label?.trim()) return [];
    return [{
      key,
      collectionKey: builtInKeys.has(key) ? key : `custom_${key.replaceAll("-", "_")}`,
      builtIn: builtInKeys.has(key),
      label: section.label.trim(),
      description: section.description?.trim() || `${section.label.trim()}에 관한 글을 모았습니다.`,
      order: Number.isFinite(section.order) ? Number(section.order) : 0,
      visible: section.visible !== false,
      showInNavigation: section.showInNavigation === true,
      showOnHome: section.showOnHome === true,
    }];
  })
  .filter((section, index, all) => all.findIndex((entry) => entry.key === section.key) === index)
  .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "ko"));

export const customContentSections = writerSections.filter((section) => !section.builtIn);

export function getWriterSection(key: string) {
  return writerSections.find((section) => section.key === key);
}

export function getCustomContentSection(key: string) {
  return customContentSections.find((section) => section.key === key);
}
