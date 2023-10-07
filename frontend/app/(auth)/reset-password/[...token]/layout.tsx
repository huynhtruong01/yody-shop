import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface IResetPasswordLayoutProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Đặt lại mật khẩu - YODY',
}

export default function ResetPasswordLayout({ children }: IResetPasswordLayoutProps) {
   return <>{children}</>
}
