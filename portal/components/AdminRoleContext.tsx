'use client'

import { createContext, useContext } from 'react'

type AdminRole = 'super_admin' | 'staff'

interface AdminRoleContextType {
    role: AdminRole
    name: string
    isSuperAdmin: boolean
}

const AdminRoleContext = createContext<AdminRoleContextType>({
    role: 'staff',
    name: '',
    isSuperAdmin: false,
})

export function AdminRoleProvider({
    role,
    name,
    children,
}: {
    role: AdminRole
    name: string
    children: React.ReactNode
}) {
    return (
        <AdminRoleContext.Provider value={{ role, name, isSuperAdmin: role === 'super_admin' }}>
            {children}
        </AdminRoleContext.Provider>
    )
}

export function useAdminRole() {
    return useContext(AdminRoleContext)
}
