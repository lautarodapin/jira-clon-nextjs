import {ClientProvider} from '@/components/trpc.client'
import "@/styles/globals.css"
import Link from 'next/link'

export const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

export default function RootLayout(props: {
    children: React.ReactNode
    ticket: React.ReactNode
}) {
    return (
        <ClientProvider>
            <html lang="en" data-theme='dracula'>
                <body>
                    <div className="navbar bg-base-100">
                        <div className="flex-1">
                            <Link href='/' className="btn btn-ghost normal-case text-xl">Next.js</Link>
                        </div>
                        <div className="flex-none">
                            <ul className="menu menu-horizontal px-1">
                                <li><Link href='/kanban'>KanBan</Link></li>
                            </ul>
                        </div>
                    </div>
                    <main className="text-white flex min-h-[calc(100vh_-_4rem)] flex-col items-center justify-center bg-neutral">
                        {props.children}
                        {props.ticket}
                    </main>
                </body>
            </html>
        </ClientProvider>
    )
}
