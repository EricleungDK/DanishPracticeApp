import type { AppAPI } from '../../../src/shared/types/api'

export function createElectronApi(): AppAPI {
  return window.api
}
