import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface IForgotPasswordLayoutProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Quên mật khẩu - YODY',
}

export default function ForgotPasswordLayout({ children }: IForgotPasswordLayoutProps) {
   return <>{children}</>
}
