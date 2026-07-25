export interface SocialLink {
  platform: string;
  url: string;
  handle?: string;
  icon?: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/Rohitmehta395",
    handle: "@Rohitmehta395",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/rohitmehta395/",
    handle: "in/rohitmehta395",
  },
  {
    platform: "Instagram",
    url: "https://www.instagram.com/rohit_._mehta/",
    handle: "@rohit_._mehta",
  },
  {
    platform: "Email",
    url: "mailto:rohitmehtaddn@gmail.com",
    handle: "rohitmehtaddn@gmail.com",
  },
];

export default SOCIAL_LINKS;
