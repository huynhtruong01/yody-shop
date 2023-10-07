import { Metadata } from 'next'
import { ReactNode } from 'react'

export interface IRecentlyViewedProps {
   children: ReactNode
}

export const metadata: Metadata = {
   title: 'Sản phẩm đã xem - YODY',
}

export default function RecentlyViewed({ children }: IRecentlyViewedProps) {
   return <>{children}</>
}
