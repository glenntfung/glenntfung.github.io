"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { 
  Beaker, 
  Code2, 
  Terminal, 
  BrainCircuit,
  LucideIcon
} from "lucide-react";

interface TechItem {
  name: string;
  logo: string;
}

const researchTools: TechItem[] = [
  { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Julia", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg" },
  { name: "R", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
  { name: "MATLAB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
  { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "JAX", logo: "https://raw.githubusercontent.com/google/jax/main/images/jax_logo_250px.png" },
  { name: "NumPy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
];

const aiDataTools: TechItem[] = [
  { name: "Hugging Face", logo: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" },
  { name: "Snowflake", logo: "https://www.vectorlogo.zone/logos/snowflake/snowflake-icon.svg" },
  { name: "AWS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "TensorFlow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "Scikit-learn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
];

const devTools: TechItem[] = [
  { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg" },
  { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" },
  { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
];

const environments: TechItem[] = [
  { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Vim", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
  { name: "Bash", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
  { name: "LaTeX", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/LaTeX_logo.svg" },
];

const BentoBox = ({ 
  title, 
  icon: Icon, 
  items, 
  className = "", 
  delay = 0 
}: { 
  title: string; 
  icon: LucideIcon; 
  items: TechItem[]; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.21, 0.45, 0.32, 0.9] }}
    className={`relative overflow-hidden rounded-3xl border border-neutral-100/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md p-6 group transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 hover:-translate-y-1 ${className}`}
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/5 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
    
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-xl font-bold font-serif text-primary">{title}</h3>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
      {items.map((item) => (
        <div key={item.name} className="flex flex-col items-center gap-2 group/item">
          <div className="relative w-8 h-8 transition-all duration-300 group-hover/item:scale-110 grayscale group-hover/item:grayscale-0 opacity-60 group-hover/item:opacity-100">
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className="object-contain dark:invert"
              unoptimized
            />
          </div>
          <span className="text-[9px] font-semibold text-neutral-400 group-hover/item:text-accent uppercase tracking-widest text-center transition-colors">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function TechStack() {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-primary flex-shrink-0 font-serif">Tech & Tools</h2>
          <div className="h-[1px] w-full bg-neutral-100 dark:bg-neutral-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scientific Computing */}
        <BentoBox 
          title="Computation" 
          icon={Beaker} 
          items={researchTools} 
          delay={0.1}
        />

        {/* AI & Data */}
        <BentoBox 
          title="AI & Data" 
          icon={BrainCircuit} 
          items={aiDataTools} 
          delay={0.2}
        />

        {/* Web & App */}
        <BentoBox 
          title="Engineering" 
          icon={Code2} 
          items={devTools} 
          delay={0.3}
        />

        {/* Environments */}
        <BentoBox 
          title="Environments" 
          icon={Terminal} 
          items={environments} 
          delay={0.4}
        />
      </div>
    </div>
  );
}
