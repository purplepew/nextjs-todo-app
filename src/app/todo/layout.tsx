'use server'
import { ReactNode } from 'react'
import Popup from './Popup'

const layout = ({ children }: { children: ReactNode }) => {

    return (
            <Popup>
                {children}
            </Popup>
    )
}

export default layout