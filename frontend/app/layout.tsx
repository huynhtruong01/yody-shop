import {
   ContainerFetchAddresses,
   PhoneMobile,
   ScrollTop,
   SessionProvider,
} from '@/components/common'
import {
   ModalDelete,
   ModalLogout,
   ModalNotificationLogin,
   ModalReport,
} from '@/components/modals'
import { ReduxProvider } from '@/store/provider'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const metadata: Metadata = {
   title: 'YODY - Mặc Mỗi Ngày, Thoải Mái Mỗi Ngày',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
   const session = await getServerSession(authOptions)

   return (
      <html lang="en">
         <body className="overflow-x-hidden">
            <SessionProvider session={session}>
               <ReduxProvider>
                  <ContainerFetchAddresses>
                     <main className="min-h-screen">
                        {children}{' '}
                        <>
                           <ModalDelete />
                           <ModalLogout />
                           <PhoneMobile />
                           <ModalNotificationLogin />
                           <ModalReport />
                           <ScrollTop />
                        </>
                     </main>
                  </ContainerFetchAddresses>
               </ReduxProvider>
            </SessionProvider>
         </body>
      </html>
   )
}
