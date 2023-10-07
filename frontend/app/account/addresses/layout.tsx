import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface IAddressesLayoutProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Địa chỉ - YODY',
}

export default function AddressesLayout({ children }: IAddressesLayoutProps) {
   return <>{children}</>
}
