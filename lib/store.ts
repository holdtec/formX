
import { RuntimeStore } from '../types';

/**
 * A "Vanilla" Store Implementation with Deep Path Support
 */
export function createVanillaStore(initialState: Record<string, any> = {}): RuntimeStore {
  let state = JSON.parse(JSON.stringify(initialState)); // Deep copy init
  const listeners: Set<(paths: string[]) => void> = new Set();
  
  // Helper to set value by path "items.0.price"
  const setDeepValue = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) current[part] = {}; // or [] depending on logic, simplified here
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  };

  return {
    getState: () => state,
    
    setValue: (path: string, value: any) => {
      // Immutable update simulation (inefficient but safe for demo)
      const nextState = JSON.parse(JSON.stringify(state));
      setDeepValue(nextState, path, value);
      state = nextState;
      
      listeners.forEach(fn => fn([path]));
    },
    
    batch: (fn: () => void) => {
      fn(); 
    },

    subscribe: (listener: (paths: string[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
