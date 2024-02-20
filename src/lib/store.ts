import { writable } from "svelte/store";
import type { PyodideInterface} from "pyodide";

export const pyodide = writable<PyodideInterface | null>(null);