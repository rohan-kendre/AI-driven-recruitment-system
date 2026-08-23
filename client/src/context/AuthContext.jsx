import { useState } from 'react'
import { AuthContext } from './authContext.js'
const demoStudent = { name: 'Aarav Kulkarni', initials: 'AK', role: 'STUDENT' }
export function AuthProvider({ children }) {
  // useState: controls mock frontend session state until Phase 1.
  const [user, setUser] = useState(demoStudent)
  return <AuthContext.Provider value={{ user, role: user?.role, isAuthenticated: Boolean(user), login: () => setUser(demoStudent), logout: () => setUser(null) }}>{children}</AuthContext.Provider>
}
