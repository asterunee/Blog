import rawEditorSettings from "@/content/settings/editor.json";

export type CustomContentSection = {
  key: string;
  collectionKey: string;
  label: string;
  description: string;
  order: number;
  visible: boolean;
  showInNavigation: boolean;
  showOnHome: boolean;
};

type RawSection = Partial<Omit<CustomContentSection, "collectionKey">>;

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
}

const raw = rawEditorSettings as { groupLabel?: string; sections?: RawSection[] };

export const editorGroupLabel = raw.groupLabel?.trim() || "콘텐츠 작성";

export const customContentSections: CustomContentSection[] = (Array.isArray(raw.sections) ? raw.sections : [])
  .flatMap((section) => {
    const key = normalizeKey(section.key || "");
    if (!key || !section.label?.trim()) return [];
    return [{
      key,
      collectionKey: `custom_${key.replaceAll("-", "_")}`,
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

export function getCustomContentSection(key: string) {
  return customContentSections.find((section) => section.key === key);
}
