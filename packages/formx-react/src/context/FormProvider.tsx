import React, { createContext, useContext, useEffect, useMemo, useRef, useReducer } from 'react';
import { createRuntime, createVanillaStore } from '@enginx/formx-core';
import type { FieldSchema, RuntimeStore } from '@enginx/formx-core';
import type { FormContextValue, FormProviderProps, FormEngine } from '../types';

const FormContext = createContext<FormContextValue | null>(null);

function createFormEngine(schema: FieldSchema[], initialValues: Record<string, any>): FormEngine {
  const store = createVanillaStore(initialValues);
  const runtime = createRuntime({ schema, store });
  
  return {
    getStore: () => runtime.getStore() as RuntimeStore,
    setValue: (path: string, value: any) => runtime.setValue(path, value),
    destroy: () => {
      // Cleanup logic if needed
    }
  };
}

export function FormProvider({ 
  schema, 
  initialValues = {}, 
  engine: externalEngine,
  children, 
  onChange 
}: FormProviderProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const internalEngine = useMemo(() => {
    return externalEngine || createFormEngine(schema, initialValues);
  }, [schema, initialValues, externalEngine]);

  useEffect(() => {
    if (!onChangeRef.current) return;
    
    const unsubscribe = internalEngine.getStore().subscribe(() => {
      onChangeRef.current?.(internalEngine.getStore().getState());
    });

    return unsubscribe;
  }, [internalEngine]);

  const contextValue = useMemo<FormContextValue>(() => ({
    engine: internalEngine,
    schema,
    initialValues
  }), [internalEngine, schema, initialValues]);

  return React.createElement(FormContext.Provider, { value: contextValue }, children);
}

export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

export function useFormEngine(): FormEngine {
  const { engine } = useFormContext();
  return engine;
}

export function useStoreState(): Record<string, any> {
  const { engine } = useFormContext();
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);
  
  useEffect(() => {
    return engine.getStore().subscribe(() => {
      forceUpdate();
    });
  }, [engine]);

  return engine.getStore().getState();
}
