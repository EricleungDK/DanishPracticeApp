import type { AppAPI } from '../../shared/types/api';

let instance: AppAPI | null = null;

export function setApiInstance(api: AppAPI): void {
  instance = api;
}

export function getApiInstance(): AppAPI {
  if (!instance) throw new Error('API not initialized — call setApiInstance() first');
  return instance;
}
