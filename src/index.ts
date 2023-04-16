import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useStore as useZustandStore } from "zustand";

import type { StoreApi } from "zustand";
import {
  CreateZustandContext,
  CreateZustandProvider,
  CreateZustandUseStore,
  CreateZustandUseStoreApi,
  ExtractState,
  WithoutCallSignature,
  CreateZustandInit,
} from "./types";

// ----
export function init<S extends StoreApi<unknown>>(): CreateZustandInit<S> {
  // [context]
  const Context: CreateZustandContext<S> = createContext<S | undefined>(
    undefined,
  );

  // [provider]
  const Provider: CreateZustandProvider<S> = ({ create, children }) => {
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

  // [use-store]
  const useStore: CreateZustandUseStore<S> = <StateSlice = ExtractState<S>>(
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

  // [use-store-api]
  const useStoreApi: CreateZustandUseStoreApi<S> = () => {
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

// [helpers]
export type { WithImmer } from "./types/with-immer";
export type {
  CreateZustandContext,
  CreateZustandProvider,
  CreateZustandProviderProps,
  CreateZustandUseStore,
  CreateZustandUseStoreApi,
  CreateZustandInit,
} from "./types";
