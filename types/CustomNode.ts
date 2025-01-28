export type CustomNode = {
  id: string;
  type?: string;
  data: { label: string; iconName?: string; imageURL?: string };
  position: { x: number; y: number; z?: number };
  draggable: boolean;
  deletable: boolean;
  parentId?: string;
  extent?: "parent";
  selected?: boolean;
};
