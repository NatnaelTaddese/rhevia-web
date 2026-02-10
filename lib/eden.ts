import { treaty } from "@elysiajs/eden";
import type { App } from "@/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL as string;

export const api = treaty<App>(backendUrl) as ReturnType<typeof treaty<App>>;
