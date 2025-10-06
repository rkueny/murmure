import { Outlet } from '@tanstack/react-router';
import { SidebarProvider, SidebarInset } from '../../components/sidebar';
import { AppSidebar } from './app-sidebar/app-sidebar';
import { Toaster } from 'sonner';

export const Layout = () => {
    return (
        <SidebarProvider defaultOpen={true} className="bg-zinc-900 dark">
            <AppSidebar />
            <SidebarInset className="bg-zinc-900 text-white">
                <Outlet />
            </SidebarInset>
            <Toaster />
        </SidebarProvider>
    );
};
