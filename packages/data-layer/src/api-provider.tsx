import { createContext, useContext } from 'react'
import type { AppAPI } from '../../../src/shared/types/api'

const ApiContext = createContext<AppAPI | null>(null)

export const ApiProvider = ApiContext.Provider

export function useApi(): AppAPI {
  const api = useContext(ApiContext)
  if (!api) throw new Error('ApiProvider not found — wrap your app with <ApiProvider>')
  return api
}
