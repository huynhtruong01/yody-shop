'use client'

import { IUser } from '@/models'
import { AppState } from '@/store'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { connect } from 'react-redux'

export interface IContainerProps {
   children: ReactNode
   className?: string
   pUser: IUser | null
}

const noLogged = ['/login', '/signup', '/verify-account']

const logged = [
   '/cart',
   '/checkout',
   '/account',
   '/account/addresses',
   '/account/favorite-products',
   '/account/purchase',
   '/account/recently-viewed',
]

function Container({ children, className = '', pUser }: IContainerProps) {
   const router = useRouter()
   const pathname = usePathname()

   useEffect(() => {
      if (noLogged.includes(pathname) && pUser) {
         router.back()
      }

      if (logged.includes(pathname) && !pUser) {
         router.push('/')
      }
   }, [pathname])

   return <div className={`w-[1280px] px-5 m-auto ${className}`}>{children}</div>
}

const mapStateToProps = (state: AppState) => {
   return {
      pUser: state.user.user,
   }
}

export default connect(mapStateToProps, null)(Container)
