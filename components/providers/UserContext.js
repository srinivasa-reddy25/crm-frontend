"use client"

import { createContext, useContext } from "react"

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ value, children }) => (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
)