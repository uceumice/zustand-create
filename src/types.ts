import React from "react";
import { StoreApi } from "zustand";

// ----
export interface CreateZustandInit<S extends StoreApi<unknown>> {
  Context: CreateZustandContext<S>;
  Provider: CreateZustandProvider<S>;
  useStore: CreateZustandUseStore<S>;
  useStoreApi: CreateZustandUseStoreApi<S>;
}

// [context]
export type CreateZustandContext<S extends StoreApi<unknown>> = React.Context<
  S | undefined
>;

// [provider]
export interface CreateZustandProvider<S extends StoreApi<unknown>> {
  (props: CreateZustandProviderProps<S>): React.FunctionComponentElement<
    React.ProviderProps<S | undefined>
  >;
}

export interface CreateZustandProviderProps<S extends StoreApi<unknown>>
  extends React.PropsWithChildren<{
    create: () => S;
  }> {}

// [use-store]
export interface CreateZustandUseStore<S extends StoreApi<unknown>> {
  (): ExtractState<S>;
  <U>(
    selector: (state: ExtractState<S>) => U,
    equalityFn?: (a: U, b: U) => boolean,
  ): U;
}

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

// [use-store-api]
export interface CreateZustandUseStoreApi<S extends StoreApi<unknown>> {
  (): WithoutCallSignature<S>;
}

export type WithoutCallSignature<T> = { [K in keyof T]: T[K] };
