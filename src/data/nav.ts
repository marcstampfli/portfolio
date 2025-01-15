import { Home, User, Briefcase, FolderGit2, Mail } from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "#home", label: "Home", icon: Home },
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
  { href: "#contact", label: "Contact", icon: Mail },
];
