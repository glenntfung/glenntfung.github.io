import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon, SparklesIcon, CalendarIcon } from "lucide-react";

export const DATA = {
  name: "Glenn Fung",
  initials: "GF",
  url: "https://glenntfung.github.io",
  location: "Chicago, IL",
  locationLink: "https://www.google.com/maps/place/Chicago,+IL",
  description:
    "Empirical Research Fellow in Quantitative Marketing at Northwestern University Kellogg School of Management",
  summary:
    "", // Use custom component in page.tsx instead
  avatarUrl: "/me.jpg",

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "/showcase", icon: SparklesIcon, label: "Misc" },
  ],
  contact: {
    email: "glenntfung@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/glenntfung",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/glennfung",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:glenntfung@gmail.com",
        icon: Icons.email,
        navbar: true,
      },
      Calendar: {
        name: "Book a Chat",
        url: "https://cal.com/glenn-fung-mqul3k/default",
        icon: CalendarIcon,
        navbar: false,
      },
    },
  },

  technicalExperience: [
    {
      company: "Northwestern Kellogg",
      href: "https://www.kellogg.northwestern.edu",
      badges: [],
      location: "Evanston, IL",
      title: "Empirical Research Fellow",
      logoUrl: "/assets/img/logos/kellogg.png",
      start: "2025",
      end: "Present",
      bullets: [
        "Working with Professor Artem Timoshenko",
      ],
    },
    {
      company: "UChicago Booth",
      badges: [],
      href: "https://www.chicagobooth.edu",
      location: "Chicago, IL",
      title: "Research Assistant",
      logoUrl: "/assets/img/logos/booth.jpg",
      start: "2025",
      end: "2025",
      bullets: [
        "Worked with Professor Dacheng Xiu for applications of LLMs",
      ],
    },
    {
      company: "NUS Business School",
      href: "https://bschool.nus.edu.sg",
      badges: [],
      location: "Singapore",
      title: "Research Assistant",
      logoUrl: "/assets/img/logos/nusbs.jpeg",
      start: "2024",
      end: "2025",
      bullets: [
        "Worked with Professor Yuting Zhu for sales and applications of LLMs",
      ],
    },
     {
      company: "Jinan – Birmingham Joint Institute",
      href: "https://www.birmingham.ac.uk/about/college-of-engineering-and-physical-sciences/mathematics/undergraduate/jinan-birmingham",
      badges: [],
      location: "Guangzhou, China",
      title: "Research Assistant",
      logoUrl: "/assets/img/logos/jbji.png",
      start: "2023",
      end: "2024",
      bullets: [
        "Worked with Professor David Ong for behavioral economics",
      ],
    },
     {
      company: "University of Birmingham School of Mathematics",
      href: "https://www.birmingham.ac.uk/schools/mathematics",
      badges: [],
      location: "Birmingham, UK",
      title: "Research Assistant",
      logoUrl: "/assets/img/logos/birmingham.svg.png",
      start: "2023",
      end: "2023",
      bullets: [
        "Worked with Professor Rowland Seymour on Bayesian computations",
      ],
    },
    {
      company: "Jinan – Birmingham Joint Institute",
      href: "https://www.birmingham.ac.uk/about/college-of-engineering-and-physical-sciences/mathematics/undergraduate/jinan-birmingham",
      badges: [],
      location: "Guangzhou, China",
      title: "Teaching Assistant",
      logoUrl: "/assets/img/logos/jbji.png",
      start: "2022",
      end: "2022",
      bullets: [
        "Introduction to Microeconomics, TA to Professor David Ong",
        "Intermediate Microeconomics, TA to Professor David Ong. <a href='/teaching/intermediate-microeconomics'>[Course Materials]</a>"
      ],
    },
  ],
  education: [
    {
      school: "Northwestern University",
      href: "https://www.northwestern.edu",
      degree: "Doctoral Coursework, Quantitative Marketing",
      logoUrl: "/assets/img/logos/nu.svg.png",
      start: "2025",
      end: "Present",
    },
    {
      school: "The University of Chicago",
      href: "https://www.uchicago.edu",
      degree: "M.A., Social Sciences, Economics",
      logoUrl: "/assets/img/logos/uchi.png",
      start: "2024",
      end: "2025",
    },
    {
      school: "The University of Birmingham",
      href: "https://www.birmingham.ac.uk",
      degree: "B.S., Applied Mathematics, with Honors",
      logoUrl: "/assets/img/logos/birmingham.svg.png",
      start: "2020",
      end: "2024",
    },
    {
      school: "Jinan University",
      href: "https://english.jnu.edu.cn",
      degree: "B.A., Economics",
      logoUrl: "/assets/img/logos/jinan.png",
      start: "2020",
      end: "2024",
    },
     {
      school: "The University of California, Los Angeles",
      href: "https://www.ucla.edu",
      degree: "Summer Session, Managerial Finance",
      logoUrl: "/assets/img/logos/ucla.svg.png",
      start: "2022",
      end: "2022",
    },
  ],
  projects: [],
  books: [],
} as const;
