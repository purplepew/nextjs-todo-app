'use client'
import { selectCurrentToken } from '@/app/lib/features/auth/authSlice'
import { useAppSelector } from '@/app/lib/hooks'
import { jwtDecode } from 'jwt-decode'
import { IUserInfo } from '@/app/lib/models/userModel'

const useAuth = () => {
    
    const token = useAppSelector(selectCurrentToken) 

    if (token) {
        const decoded = jwtDecode(token) as IUserInfo
        const { email, name, picture, id } = decoded.UserInfo

        return { email, name, picture, id }
    }

    return { email: null, name: null, picture: null, id: null }
}

export default useAuth