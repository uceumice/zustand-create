import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useStore as useZustandStore } from "zustand";

import type { ReactNode } from "react";
import type { StoreApi } from "zustand";

// ----
export type UseContextStore<S extends StoreApi<unknown>> = {
  (): ExtractState<S>;
  <U>(
    selector: (state: ExtractState<S>) => U,
    equalityFn?: (a: U, b: U) => boolean,
  ): U;
};

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type WithoutCallSignature<T> = { [K in keyof T]: T[K] };

// ----
export function init<S extends StoreApi<unknown>>() {
  // [1] create react context which would hold the reference to zustand store
  const Context = createContext<S | undefined>(undefined);

  // [2] create a store provider
  const Provider = ({
    create,
    children,
  }: {
    create: () => S;
    children: ReactNode;
  }) => {
    const storeRef = useRef<S>();

    if (!storeRef.current) {
      storeRef.current = create();
    }

    return createElement(
      Context.Provider,
      { value: storeRef.current },
      children,
    );
  };

  // [3] create a store hook
  const useStore: UseContextStore<S> = <StateSlice = ExtractState<S>>(
    selector?: (state: ExtractState<S>) => StateSlice,
    equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
  ) => {
    const store = useContext(Context);
    if (!store) {
      throw new Error(
        "Seems like you have not used zustand provider as an ancestor.",
      );
    }

    return useZustandStore(
      store,
      selector as (state: ExtractState<S>) => StateSlice,
      equalityFn,
    );
  };

  // [4] create a store api hook
  const useStoreApi = () => {
    const store = useContext(Context);
    if (!store) {
      throw new Error(
        "Seems like you have not used zustand provider as an ancestor.",
      );
    }
    return useMemo<WithoutCallSignature<S>>(() => {
      return { ...store };
    }, [store]);
  };

  return {
    Context,
    Provider,
    useStore,
    useStoreApi,
  };
}
