import { createContext, useContext } from "react"

export const contactsSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useContactSource = () => {
    const context = useContext(contactsSourceContext)
    if (!context) throw new Error('useContactSource must be used within ContactSourceProvider')
    return context
}

export const faqSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useFAQSource = () => {
    const context = useContext(faqSourceContext)
    if (!context) throw new Error('useFAQSource must be used within TextSourceProvider')
    return context
}


export const productsSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useProductSource = () => {
    const context = useContext(productsSourceContext)
    if (!context) throw new Error('useProductSource must be used within ProductSourceProvider')
    return context
}


export const textSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useTextSource = () => {
    const context = useContext(textSourceContext)
    if (!context) throw new Error('useTextSource must be used within TextSourceProvider')
    return context
}

export const sourcesContext = createContext<{ sourcesRefetch: () => void; } | undefined>(undefined)

export const useSources = () => {
  const context = useContext(sourcesContext)
  if (!context) throw new Error('useSources must be used within SourcesProvider')
  return context
}
