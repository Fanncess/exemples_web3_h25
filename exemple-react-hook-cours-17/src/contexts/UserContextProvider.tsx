import { JSX, useState } from "react";
import { UserContext } from "./userContext";

type Props = {
    children: JSX.Element
}

export function UserContextProvider({ children }: Props) {
    const [user, setUser] = useState("Jesse asdfasdfasd");
    
    return (
        <UserContext.Provider value={{ nomComplet: user }}>
            { children }
        </UserContext.Provider>
    );
}