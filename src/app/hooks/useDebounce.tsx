'use client'
import { useEffect, useState } from "react";

export default function useDebounce(newValue: string, delay: number){
    const [value, setValue] = useState("")

    useEffect(()=>{
        const setter = setTimeout(()=>{
            setValue(newValue)
        }, delay)

        return () => clearTimeout(setter)
    }, [])

    return value
}