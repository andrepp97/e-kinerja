import React, { createContext, useContext, useReducer } from 'react';


// === Create & Export AuthContext ===
const AuthContext = createContext()
export const useAuth = () => {
    return useContext(AuthContext)
}


// === Main Component ===
const AuthProvider = ({ children }) => {

    // INITIAL STATE
    const initialState = {
        id: 0,
        role: "",
        name: "",
        username: "",
        userToken: null,
        isLogin: false,
        isLoading: true,
    }

    // USER REDUCER
    const userReducer = (prevState, action) => {
        switch (action.type) {
            case "LOGIN":
                return {
                    ...prevState,
                    id: action.id,
                    role: action.role,
                    name: action.name,
                    username: action.username,
                    userToken: action.token,
                    isLogin: true,
                    isLoading: false,
                }
            case "LOGOUT":
                return {...initialState, isLoading: false}
            case "LOADING_TRUE":
                return {...prevState, isLoading: true}
            case "LOADING_FALSE":
                return {...prevState, isLoading: false}
            default:
                return prevState
        }
    }

    // USER STATE FOR GLOBAL USAGE
    const [userState, dispatch] = useReducer(userReducer, initialState)

    // MAIN RENDER
    return (
        <AuthContext.Provider value={{userState, dispatch}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;