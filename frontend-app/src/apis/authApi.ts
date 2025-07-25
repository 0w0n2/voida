import apiInstance from './apiInstance'

export const login = (email: string, password: string) => {
  return apiInstance.post('/auth/login', { email, password })
}
