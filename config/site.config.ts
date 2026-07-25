export interface SiteConfig {
  name: string;
  author: string;
  role: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    linkedin: string;
    instagram: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Developer Portfolio",
  author: "Rohit",
  role: "Creative Software Developer",
  description:
    "Portfolio of Rohit, a Creative Software Developer crafting premium, animated digital experiences.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/images/og-default.png",
  links: {
    github: "https://github.com/Rohitmehta395",
    linkedin: "https://www.linkedin.com/in/rohitmehta395/",
    instagram: "https://www.instagram.com/rohit_._mehta/",
  },
};
