# 🔌 自定义 Store 状态库注入

`@enginx/formx-core` 遵循经典的 **控制反转 (IoC)** 原则，计算内核完全不绑定任何特定的框架和状态管理器。 

内核通过 `RuntimeStore` 接口来读写数据。如果您的小程序使用的是 **MobX**，或者 Vue 项目使用的是 **Pinia / Vuex**，只需要通过对应的适配器包装您的 Store 实例，即可无缝注入引擎使用。

---

## 1. 注入 MobX 适配器 (适用于微信小程序 / React / MobX)

在微信小程序中，全局或页面的状态多由 MobX 管理。你可以使用以下适配器，将 MobX 的 Observable 状态实例注入到 Formx 中：

```typescript
import { runInAction } from 'mobx';
import { RuntimeStore } from '@enginx/formx-core';

// 深度路径值写入助手 (例如: "items.0.price" -> 10)
function setDeepValue(obj: any, path: string, value: any) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * 包装 MobX Observable 状态为 Formx 兼容的 RuntimeStore
 * @param mobxState Observable 响应式状态对象
 */
export function createMobxStoreAdapter(mobxState: any): RuntimeStore {
  const listeners = new Set<(paths: string[]) => void>();

  return {
    // 1. 获取当前状态引用
    getState: () => mobxState,

    // 2. 写入状态：在 MobX 的 action / runInAction 中执行修改，保证合规
    setValue: (path: string, value: any) => {
      runInAction(() => {
        setDeepValue(mobxState, path, value);
      });
      // 触发 Formx 字段监听重算
      listeners.forEach(listener => listener([path]));
    },

    // 3. 事务处理：利用 MobX 的 runInAction 合并多次变动
    batch: (updater: () => void) => {
      runInAction(updater);
    },

    // 4. 状态订阅
    subscribe: (listener: (paths: string[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
```

---

## 2. 注入 Vue 3 / Pinia 适配器

在 Vue 3 应用中，可以直接把 Pinia Store 或响应式 `reactive` 对象包装成适配器注入：

```typescript
import { reactive } from 'vue';
import { RuntimeStore } from '@enginx/formx-core';

function setDeepValue(obj: any, path: string, value: any) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) current[part] = {};
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * 将 Vue3 响应式状态包装为 RuntimeStore
 */
export function createVueStoreAdapter(initialState: any): RuntimeStore {
  // 建立深度响应式对象
  const state = reactive(initialState);
  const listeners = new Set<(paths: string[]) => void>();

  return {
    getState: () => state,

    setValue: (path: string, value: any) => {
      setDeepValue(state, path, value);
      listeners.forEach(listener => listener([path]));
    },

    // Vue 3 内部默认自带异步调度 batching DOM 重绘，在计算层保持同步执行即可
    batch: (updater: () => void) => {
      updater();
    },

    subscribe: (listener: (paths: string[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
```

---

## 3. 注入 Vuex 4 适配器

在旧版项目或传统 Vuex 单向数据流架构下，可以通过 Mutation 注入更新：

```typescript
import { Store } from 'vuex';
import { RuntimeStore } from '@enginx/formx-core';

export function createVuexStoreAdapter(vuexStore: Store<any>, moduleNamespace = ''): RuntimeStore {
  const listeners = new Set<(paths: string[]) => void>();

  // 订阅 Vuex mutation 的变动，在表单字段被修改时通知 Formx 内核
  vuexStore.subscribe((mutation) => {
    if (mutation.type.endsWith('UPDATE_FORM_FIELD')) {
      const { path } = mutation.payload;
      listeners.forEach(listener => listener([path]));
    }
  });

  return {
    getState: () => {
      return moduleNamespace 
        ? vuexStore.state[moduleNamespace] 
        : vuexStore.state;
    },

    setValue: (path: string, value: any) => {
      // 触发 Mutation 改变状态，保证状态可追踪和时间旅行调试
      const mutationType = moduleNamespace 
        ? `${moduleNamespace}/UPDATE_FORM_FIELD` 
        : 'UPDATE_FORM_FIELD';
      vuexStore.commit(mutationType, { path, value });
    },

    batch: (updater: () => void) => {
      updater();
    },

    subscribe: (listener: (paths: string[]) => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }
  };
}
```
