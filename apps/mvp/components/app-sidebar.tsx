import {
  ScrollText,
  Inbox,
  ChartBar,
  BotIcon
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import SignInButton from "../features/auth/components/AuthToggler"
import { ModeToggle } from "./theme-toggler"

const items = [
  {
    title: "Jobs List",
    url: "/",
    icon: ScrollText,
  },
  {
    title: "JobTrack AI",
    url: "/chatbot",
    icon: BotIcon,
  },
  {
    title: "Statistics",
    url: "/stats",
    icon: ChartBar
  }
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full px-2 py-4">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xl font-bold px-3 mb-2 border-b rounded-none">
              JobTrackr
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <item.icon size={32} className="text-muted-foreground" />
                        <span className="text-md font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="px-3 flex pt-4 border-t">
          <SignInButton />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}
