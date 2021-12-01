import { writable } from 'svelte/store';
import type { WorkerResponse } from '../types';

export const compiled = writable<WorkerResponse>();
