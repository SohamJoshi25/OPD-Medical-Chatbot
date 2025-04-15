import { createContext, useState, ReactNode, useContext } from "react";

export interface ResponseContextType {
    response: string;
    setResponse: React.Dispatch<React.SetStateAction<string>>;
}

// Default Context Values
const defaultContext: ResponseContextType = {
    response:"",

    setResponse: () => { },
};

// Create Context
const ResponseContext = createContext<ResponseContextType>(defaultContext);

// Provider Component
export const ResponseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [response, setResponse] = useState<string>("");

    return (
        <ResponseContext.Provider
            value={{
                response,
                setResponse
            }}
        >
            {children}
        </ResponseContext.Provider>
    );
};

// Custom Hook to use the User Context
export const useResponseContext = () => {
    const context = useContext(ResponseContext);
    if (!context) {
        throw new Error("useResponseContext must be used within a UserProvider");
    }
    return context;
};

export default ResponseContext;