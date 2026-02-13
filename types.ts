import { ReactNode } from 'react';

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

export interface CardSection {
  title?: string;
  default_collapsed?: boolean;
  fields: FieldSchema[];
}

export interface CardConfig {
  title_expression?: string;
  layout?: 'GRID' | 'FLEX';
  sections: CardSection[];
  actions?: string[];
}

export interface FieldOption {
  value: string | number;
  label: string;
  children?: FieldOption[];
}

export interface DimensionLevel {
  label: string;
  placeholder?: string;
  options?: FieldOption[];
}

export type FieldType = 
  | 'TEXT' 
  | 'TEXTAREA' 
  | 'NUMBER' 
  | 'BOOLEAN' 
  | 'SWITCH'
  | 'ENUM' 
  | 'SELECT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'SLIDER'
  | 'DATE' 
  | 'DATETIME'
  | 'DIMENSION' 
  | 'MONETARY' 
  | 'RATING'
  | 'COLOR'
  | 'FILE'
  | 'CARD_LIST' 
  | 'HIDDEN' 
  | 'READONLY'
  | string;

export interface FieldSchema {
  key: string;
  type: FieldType;
  label: string;
  span?: number;
  expression?: string; 
  visible_if?: string; 
  disabled_if?: string; 
  read_only?: boolean;
  
  ui?: FieldUIConfig;
  behavior?: FieldBehavior;
  slot?: FieldSlot;
  
  card?: CardConfig;

  options?: FieldOption[];
  levels?: DimensionLevel[];
  
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  
  prefix?: string;
  suffix?: string;
  
  direction?: 'horizontal' | 'vertical';
  
  allowHalf?: boolean;
  
  accept?: string;
  multiple?: boolean;
  
  format?: 'currency' | 'percent' | string;
  
  showValue?: boolean;
}

export interface RuntimeStore {
  getState(): Record<string, any>;
  setValue(path: string, value: any): void;
  batch(updater: () => void): void;
  subscribe(listener: (changedPaths: string[]) => void): () => void;
}

export interface RuntimeEngineOptions {
  schema: FieldSchema[];
  store: RuntimeStore;
  functions?: Record<string, Function>;
}
