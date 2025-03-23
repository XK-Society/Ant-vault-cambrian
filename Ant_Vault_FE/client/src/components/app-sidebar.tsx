import { useQuery } from "@tanstack/react-query";
//import info from "@/lib/info.json";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api";
import { NavLink, useLocation } from "react-router";
import type { UUID } from "@elizaos/core";
import { Book, Cog, User } from "lucide-react";
import CountdownTimer from "./countdowntimer";
//import ConnectionStatus from "./connection-status";

export function AppSidebar() {
    const location = useLocation();
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000,
    });

    const agents = query?.data?.agents;

    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <img src="antvault-logo.png" alt="antvault-logo" width="100%"/>
                </div>
            </SidebarHeader> 
            <SidebarContent>
                <div className="p-2">
                    <CountdownTimer />
                </div>
                <div className="px-2">
                    <div className="flex flex-col gap-2 text-white rounded-xl shadow-md p-6 max-w-[240px] bg-gray-200 bg-opacity-30 backdrop-filter backdrop-blur-lg">
                        <h1 className="text-sm">Objectives:</h1>
                        <span className="text-xs">1. Survive the winter.</span>
                        <span className="text-xs">2. Survive the winter.</span>
                    </div>
                </div>
                {/* <SidebarGroup>
                    <SidebarGroupLabel>Agents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                                <div>
                                    {agents?.map(
                                        (agent: { id: UUID; name: string }) => (
                                            <SidebarMenuItem key={agent.id}>
                                                <NavLink
                                                    to={`/chat/${agent.id}`}
                                                >
                                                    <SidebarMenuButton
                                                        isActive={location.pathname.includes(
                                                            agent.id
                                                        )}
                                                    >
                                                        <User />
                                                        <span>
                                                            {agent.name}
                                                        </span>
                                                    </SidebarMenuButton>
                                                </NavLink>
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </div>
                            
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
            </SidebarContent>
            <SidebarFooter>
                <img src="ant.gif" />
            </SidebarFooter>
        </Sidebar>
    );
}
