import {
    Home,
    Settings,
    RefreshCw,
    Info,
    ChevronRight,
    Keyboard,
    BookText,
    Power,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from '../../../components/sidebar';
import { useLocation } from '@tanstack/react-router';

const settingsSubItems = [
    { name: 'Shortcuts', url: '/settings/shortcuts', icon: Keyboard },
    {
        name: 'Custom Dictionary',
        url: '/settings/custom-dictionary',
        icon: BookText,
    },
    { name: 'System', url: '/settings/system', icon: Power },
];

export const AppSidebar = () => {
    const { pathname } = useLocation();
    const [settingsOpen, setSettingsOpen] = useState(true);

    return (
        <Sidebar
            collapsible="none"
            className="bg-zinc-900 border-zinc-700 min-h-screen h-full"
        >
            <SidebarHeader className="flex items-center justify-center bg-zinc-900 border-b border-zinc-700">
                <img src="app-icon.png" alt="logo" className="w-16 h-16" />
            </SidebarHeader>
            <SidebarContent className="bg-zinc-900">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === '/'}
                            >
                                <Link to="/">
                                    <Home />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => setSettingsOpen(!settingsOpen)}
                            >
                                <Settings />
                                <span>Settings</span>
                                <ChevronRight
                                    className={`ml-auto transition-transform ${settingsOpen ? 'rotate-90' : ''}`}
                                />
                            </SidebarMenuButton>
                            {settingsOpen && (
                                <SidebarMenuSub>
                                    {settingsSubItems.map((item) => (
                                        <SidebarMenuSubItem key={item.url}>
                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={pathname === item.url}
                                            >
                                                <Link to={item.url}>
                                                    <item.icon />
                                                    <span>{item.name}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === '/about'}
                            >
                                <Link to="/about">
                                    <Info />
                                    <span>About</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-zinc-900 border-t border-zinc-700 p-4">
                <div className="flex items-center gap-2 justify-center">
                    <button
                        onClick={() => console.log('Check for updates')}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5 px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3" />
                        <span>Check for updates</span>
                    </button>
                    <p className="text-xs text-zinc-500">0.1.0</p>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};
