import type { FieldSchema, RuntimeStore, RuntimeEngineOptions, CardSection } from '@enginx/formx-core';

export type { FieldSchema, RuntimeStore, RuntimeEngineOptions, CardSection };

export interface FormEngine {
  getStore(): RuntimeStore;
  setValue(path: string, value: any): void;
  destroy(): void;
}

export interface FormContextValue {
  engine: FormEngine;
  schema: FieldSchema[];
  initialValues: Record<string, any>;
}

export interface FieldProps {
  fieldKey: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface FieldRenderProps {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  disabled: boolean;
  readOnly: boolean;
  placeholder?: string;
  error?: string;
  field: FieldSchema;
}

export interface UseFieldOptions {
  path?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
}

export interface UseFieldReturn {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
  disabled: boolean;
  readOnly: boolean;
  field?: FieldSchema;
}

export interface FormProviderProps {
  schema: FieldSchema[];
  initialValues?: Record<string, any>;
  engine?: FormEngine;
  children: React.ReactNode;
  onChange?: (values: Record<string, any>) => void;
}

export interface FormFieldProps extends FieldProps {
  render?: (props: FieldRenderProps) => React.ReactNode;
  component?: React.ComponentType<FieldRenderProps>;
  path?: string;
}

export interface FormCardListProps {
  fieldKey: string;
  renderItem?: (props: CardItemProps) => React.ReactNode;
  itemClassName?: string;
  containerClassName?: string;
}

export interface CardItemProps {
  index: number;
  total: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onCopy?: () => void;
  data: Record<string, any>;
}

export interface FormSectionProps {
  title?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface FormGridProps {
  columns?: number;
  gap?: number;
  children: React.ReactNode;
  className?: string;
}

export type FieldType = 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'ENUM' | 'MONETARY' | 'DIMENSION';

export interface FieldComponentRegistry {
  [key: string]: React.ComponentType<FieldRenderProps>;
}
