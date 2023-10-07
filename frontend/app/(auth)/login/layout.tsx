import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface ILoginLayoutProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Đăng nhập tài khoản - YODY',
   description: 'Đăng nhập tài khoản YODY',
}

export default function LoginLayout({ children }: ILoginLayoutProps) {
   return <>{children}</>
}
