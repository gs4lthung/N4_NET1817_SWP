import React, { createContext, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

export const UserContext = createContext();

export default function AuthContext({ children }) {
    const [userAuth, setUserAuth] = useState(JSON.parse(localStorage.getItem("user")) ?? "");
    const toast = useToast();

    const deleteAccount = async () => {
        try {

            await axios
                .post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/admin/delete`, {
                    id: userAuth.id,
                })
                .then(function (response) {

                    localStorage.removeItem("user");
                    setUserAuth("");
                    toast({
                        title: "Account deleted.",
                        description: "Your account has been deleted successfully.",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                });
        } catch (err) {

            toast({
                title: "Failed to delete account.",
                description: "An error occurred while deleting your account.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            console.log(err);
        }
    };

    const value = {
        userAuth,
        deleteAccount,
    };

    return (
        <div>
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        </div>
    );
}
