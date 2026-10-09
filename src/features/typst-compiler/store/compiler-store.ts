import { create } from "zustand"

export interface CompilerState {
    isCompiling: boolean
    error: string | null
    typstVersion: string | null

    // Acciones para actualizar el estado desde el hook/motor
    setIsCompiling: (isCompiling: boolean) => void
    setError: (error: string | null) => void
    setTypstVersion: (version: string | null) => void
    setCompilerStatus: (status: {
        isCompiling?: boolean
        error?: string | null
        typstVersion?: string | null
    }) => void
}

export const useCompilerStore = create<CompilerState>((set) => ({
    isCompiling: false,
    error: null,
    typstVersion: null,

    setIsCompiling: (isCompiling) => set({ isCompiling }),
    setError: (error) => set({ error }),
    setTypstVersion: (typstVersion) => set({ typstVersion }),
    setCompilerStatus: (status) => set((state) => ({ ...state, ...status }))

}))


