import { Github, Linkedin, Download, Mail, MessageCircle } from "lucide-react";

/**
 * T029 — Persistent Sidebar Quick Actions
 *
 * Fixed right side, always visible:
 * - GitHub, LinkedIn, WhatsApp, Resume, Contact
 * 44×44px tap targets
 * Subtle premium hover
 * Mobile: compact version
 */
const sidebarLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/asadshabir/",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/asad-shabir-programmer110/",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/923253939049",
  },
  {
    icon: Download,
    label: "Resume",
    href: "/Asad_Shabir_Developer.pdf",
    download: true,
  },
  {
    icon: Mail,
    label: "Contact",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=asadshabir505@gmail.com",
  },
];

const Sidebar = () => {
  return (
    <aside
      className="fixed right-4 top-1/2 z-[100] hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-8"
      aria-label="Quick actions"
    >
      {sidebarLinks.map(({ icon: Icon, label, href, download }) => (
        <a
          key={label}
          href={href}
          download={download}
          target={download ? undefined : "_blank"}
          rel={download ? undefined : "noopener noreferrer"}
          aria-label={label}
          className="sidebar-action-btn group"
          title={label}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          <span className="sidebar-action-tooltip">{label}</span>
        </a>
      ))}
    </aside>
  );
};

export default Sidebar;