import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
// useContext: provides global mock auth state to pages and layouts.
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context }
