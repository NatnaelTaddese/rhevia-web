import { Elysia } from "elysia";
declare const app: Elysia<
  "",
  {
    decorator: {};
    store: {};
    derive: {};
    resolve: {};
  },
  {
    typebox: {};
    error: {};
  } & {
    typebox: {};
    error: {};
  } & {
    typebox: {};
    error: {};
  } & {
    typebox: import("@sinclair/typebox").TModule<{}>;
    error: {};
  },
  {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
  } & {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
  } & {
    schema: {};
    standaloneSchema: {};
    macro: {};
    macroFn: {};
    parser: {};
    response: {};
  } & {
    schema: {};
    macro: {};
    macroFn: {};
    parser: {};
  },
  {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: string;
      };
    };
  } & {
    [x: string]: {
      get: {
        body: unknown;
        params: {};
        query: unknown;
        headers: unknown;
        response: {
          200: string;
        };
      };
    };
  },
  {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
  },
  {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
  } & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
  } & {
    derive: {};
    resolve: {};
    schema: {};
    standaloneSchema: {};
    response: {};
  } & {
    derive: {};
    resolve: {};
    schema: {};
  }
>;
export default app;
export type App = typeof app;

export {};
