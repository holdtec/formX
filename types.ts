
import { ReactNode } from 'react';

// --- 1. Schema Layer (Updated for Card Model) ---

export interface FieldUIConfig {
  icon?: string;
  description?: string;
  tooltip?: string;
  tags?: string[];
  badge?: string;
  placeholder?: string;
}

export interface FieldBehavior {
  allow_add?: boolean;
  allow_remove?: boolean;
  read_only?: boolean;
}

export interface FieldSlot {
  prefix?: string; 
  suffix?: string;
  renderer?: string; 
}

// Card 内部的分组配置
export interface CardSection {
  title?: string;
  default_collapsed?: boolean;
  fields: FieldSchema[]; // 字段现在定义在 Section 内部
}

// Card 的配置定义
export interface CardConfig {
  title_expression?: string; // 动态标题表达式，如 "'商品: ' + item_name"
  layout?: 'GRID' | 'FLEX';
  sections: CardSection[]; // 支持多 Section 分组
  actions?: string[]; // ['delete', 'copy', 'move_up', 'move_down']
}

export interface FieldSchema {
  key: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'DIMENSION' | 'MONETARY' | 'CARD_LIST' | 'HIDDEN' | string;
  label: string;
  span?: number; // 1-12 Grid 布局
  expression?: string; 
  visible_if?: string; 
  disabled_if?: string; 
  read_only?: boolean;
  
  ui?: FieldUIConfig;
  behavior?: FieldBehavior;
  slot?: FieldSlot;
  
  // 当 type 为 CARD_LIST 时必填
  card?: CardConfig; 
}

// --- 2. Runtime Engine Layer ---

export interface RuntimeStore {
  getState(): Record<string, any>;
  setValue(path: string, value: any): void; // Key 变为 Path (e.g., "items.0.price")
  batch(updater: () => void): void;
  subscribe(listener: (changedPaths: string[]) => void): () => void;
}

export interface RuntimeEngineOptions {
  schema: FieldSchema[];
  store: RuntimeStore;
  functions?: Record<string, Function>;
}
