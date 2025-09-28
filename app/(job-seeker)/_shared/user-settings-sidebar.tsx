import SidebarNavMenuGroup, {
  Item,
} from "@/components/shared/sidebar-nav-menu-group";
import { BellIcon, FileUserIcon } from "lucide-react";

const items: Item[] = [
  {
    label: "Notifications",
    icon: <BellIcon />,
    href: "/user-settings/notifications",
  },
  {
    label: "Resume",
    icon: <FileUserIcon />,
    href: "/user-settings/resume",
  },
];

export function UserSettingsSidebar() {
  return <SidebarNavMenuGroup items={items} />;
}
