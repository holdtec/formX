import { useEffect, useReducer, useCallback, useMemo } from 'react';
import { useFormContext } from '../context/FormProvider';
import type { UseFieldOptions, UseFieldReturn, FieldSchema } from '../types';

function getByPath(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    const key = isNaN(Number(part)) ? part : parseInt(part, 10);
    return acc[key];
  }, obj);
}

export function useField(fieldKey: string, options: UseFieldOptions = {}): UseFieldReturn {
  const { engine, schema } = useFormContext();
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);
  
  const path = options.path || fieldKey;
  
  const field = useMemo(() => {
    return schema.find((f: FieldSchema) => f.key === fieldKey);
  }, [schema, fieldKey]);

  useEffect(() => {
    const unsubscribe = engine.getStore().subscribe((changedPaths: string[]) => {
      const isRelevant = changedPaths.some((changedPath: string) => 
        changedPath === path || changedPath.startsWith(path + '.')
      );
      if (isRelevant) {
        forceUpdate();
      }
    });
    return unsubscribe;
  }, [engine, path]);

  const value = getByPath(engine.getStore().getState(), path);

  const onChange = useCallback((newValue: any) => {
    engine.setValue(path, newValue);
    options.onChange?.(newValue);
  }, [engine, path, options]);

  const onBlur = useCallback(() => {
    options.onBlur?.(value);
  }, [options, value]);

  const disabled = field?.disabled_if ? false : false;
  const readOnly = field?.read_only ?? false;

  return {
    value,
    onChange,
    onBlur,
    disabled,
    readOnly,
    field
  };
}

export function useFieldValue(fieldKey: string): any {
  const { engine } = useFormContext();
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);
  
  useEffect(() => {
    const unsubscribe = engine.getStore().subscribe((changedPaths: string[]) => {
      const isRelevant = changedPaths.some((changedPath: string) => 
        changedPath === fieldKey || changedPath.startsWith(fieldKey + '.')
      );
      if (isRelevant) {
        forceUpdate();
      }
    });
    return unsubscribe;
  }, [engine, fieldKey]);

  return getByPath(engine.getStore().getState(), fieldKey);
}

export function useFieldSetter(fieldKey: string): (value: any) => void {
  const { engine } = useFormContext();
  
  return useCallback((value: any) => {
    engine.setValue(fieldKey, value);
  }, [engine, fieldKey]);
}

export function useListField(listKey: string): {
  items: any[];
  addItem: (item?: any) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: any) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
} {
  const { engine } = useFormContext();
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);

  useEffect(() => {
    const unsubscribe = engine.getStore().subscribe((changedPaths: string[]) => {
      const isRelevant = changedPaths.some((changedPath: string) => 
        changedPath === listKey || changedPath.startsWith(listKey + '.')
      );
      if (isRelevant) {
        forceUpdate();
      }
    });
    return unsubscribe;
  }, [engine, listKey]);

  const state = engine.getStore().getState();
  const items = state[listKey] || [];

  const addItem = useCallback((item: any = {}) => {
    const newItems = [...items, item];
    engine.setValue(listKey, newItems);
  }, [engine, listKey, items]);

  const removeItem = useCallback((index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    engine.setValue(listKey, newItems);
  }, [engine, listKey, items]);

  const updateItem = useCallback((index: number, item: any) => {
    const newItems = [...items];
    newItems[index] = item;
    engine.setValue(listKey, newItems);
  }, [engine, listKey, items]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    engine.setValue(listKey, newItems);
  }, [engine, listKey, items]);

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    moveItem
  };
}

export function useComputedValue(_expression: string): any {
  const { engine } = useFormContext();
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);

  useEffect(() => {
    const unsubscribe = engine.getStore().subscribe(() => {
      forceUpdate();
    });
    return unsubscribe;
  }, [engine]);

  return null;
}
