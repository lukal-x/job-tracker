"use client"
import { AppSidebar } from '@/components/app-sidebar'
import Navbar from '@/components/Navbar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import React from 'react'

const Providers = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();

    return (
        <>
            <SessionProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider attribute="class" defaultTheme="dark">
                        <Navbar />
                        <SidebarProvider>
                        <AppSidebar />
                        <SidebarTrigger />
                        {children}
                        </SidebarProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </SessionProvider>
        </>
  )
}

export default Providers