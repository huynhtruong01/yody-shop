'use client'

import { Container, NavUserInfo } from '@/components/common'
import { IUser } from '@/models'
import { AppState } from '@/store'
import { ReactNode } from 'react'
import { connect } from 'react-redux'

export interface IOwnerInfoProps {
   title: string
   children: ReactNode
   pUser: IUser | null
}

function OwnerInfo({ title, children, pUser }: IOwnerInfoProps) {
   return (
      pUser && (
         <Container>
            <div>
               <h1 className="uppercase text-secondary-dark text-center text-xl font-semibold my-4">
                  {title}
               </h1>
               <div className="mt-10">
                  <div className="flex justify-between gap-8">
                     <div className="rounded w-[290px]">
                        <NavUserInfo user={pUser} className="bg-white rounded" />
                     </div>
                     <div className="bg-white rounded relative flex-1">{children}</div>
                  </div>
               </div>
            </div>
         </Container>
      )
   )
}

const mapStateToProps = (state: AppState) => {
   return {
      pUser: state.user.user,
   }
}

export default connect(mapStateToProps, null)(OwnerInfo)
