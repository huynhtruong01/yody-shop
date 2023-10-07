import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface IChangePasswordLayoutProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Thay đổi mật khẩu - YODY',
}

export default function ChangePasswordLayout({ children }: IChangePasswordLayoutProps) {
   return <>{children}</>
}
