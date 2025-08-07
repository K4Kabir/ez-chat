'use client'
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useEffect } from 'react'
import { useUserContext } from '@/context/UserContext';


const page = () => {
    const { user } = useUser()
    const checkUser = useMutation(api.user.CheckUser)
    const { setUser } = useUserContext();

    useEffect(() => {
        if (user) {
            checkUser({
                id: user.id,
                userName: user.fullName || "Anonymous"
            }).then((res) => {
                setUser(res);
            })
        }
    }, [user, checkUser, setUser])

    return (
        <div>
            Dashboard
        </div>
    )
}

export default page
