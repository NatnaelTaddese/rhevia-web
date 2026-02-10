import { treaty } from "@elysiajs/eden";
import type { App } from "../types/server";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export const api = treaty<App>(backendUrl);
