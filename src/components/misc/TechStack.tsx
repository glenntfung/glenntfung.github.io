"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Grid3X3, ArrowLeft } from "lucide-react";

interface TechItem {
  name: string;
  logo: string;
}

interface TechCategory {
  category: string;
  subcategories?: {
    name: string;
    items: TechItem[];
  }[];
  items?: TechItem[];
}

const techCategories: TechCategory[] = [
  {
    category: "Scientific Computing & Analytics",
    subcategories: [
      {
        name: "Languages",
        items: [
          { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
          { name: "Julia", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/julia/julia-original.svg" },
          { name: "R", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" },
          { name: "MATLAB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
          { name: "C++", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
          { name: "C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
          { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
          { name: "LaTeX", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/LaTeX_logo.svg" },
        ]
      },
      {
        name: "AI & Scientific Computing",
        items: [
          { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
          { name: "JAX", logo: "https://raw.githubusercontent.com/google/jax/main/images/jax_logo_250px.png" },
          { name: "TensorFlow", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
          { name: "Scikit-learn", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg" },
          { name: "NumPy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
          { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
        ]
      },
      {
        name: "Environments",
        items: [
             { name: "Jupyter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg" },
             { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
             { name: "RStudio", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rstudio/rstudio-original.svg" },
             { name: "Vim", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vim/vim-original.svg" },
        ]
      }
    ]
  },
  {
    category: "Web & Application Development",
    subcategories: [
      {
        name: "Frontend",
        items: [
          { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
          { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg" },
          { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
          { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
          { name: "HTML", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
          { name: "Tailwind CSS", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
        ]
      },
      {
        name: "Backend & Data",
        items: [
          { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" },
          { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        ]
      }
    ]
  },
  {
    category: "DevOps & Tools",
    items: [
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "Bash", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" },
    ]
  }
];

const allTechItems: TechItem[] = techCategories.flatMap(category => 
  category.subcategories 
    ? category.subcategories.flatMap(sub => sub.items)
    : category.items || []
);

const TechItem = ({ tech, showName = false }: { tech: TechItem; showName?: boolean }) => {
  return (
    <div className={`flex ${showName ? 'flex-col' : ''} items-center justify-center ${showName ? 'p-4' : 'mx-6'} group cursor-default`}>
      <div className={`relative ${showName ? 'w-16 h-16' : 'w-12 h-12'} transition-all duration-200 ease-out group-hover:scale-[1.02] opacity-70 hover:opacity-100`}>
        <Image
          src={tech.logo}
          alt={`${tech.name} logo`}
          fill
          className="object-contain filter transition-all duration-200 dark:invert"
          unoptimized
        />
      </div>
      {showName && (
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 text-center mt-2 whitespace-nowrap transition-colors duration-200 group-hover:text-accent">
          {tech.name}
        </span>
      )}
    </div>
  );
};

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [showAll, setShowAll] = useState(false);
  const duplicatedTechStack = [...allTechItems, ...allTechItems];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 5 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Tech Stack</h2>
          <p className="text-sm text-neutral-500 mt-1">Technologies and tools I work with.</p>
        </div>
      </div>

      {!showAll ? (
        <>
          <div className="relative w-full overflow-hidden py-8">
            <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
            <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
            
            <motion.div
              className="flex items-center"
              animate={{ x: [0, -50 + "%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 45,
                  ease: "linear",
                },
              }}
            >
              {duplicatedTechStack.map((tech, index) => (
                <TechItem key={`${tech.name}-${index}`} tech={tech} />
              ))}
            </motion.div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="flex items-center justify-center h-10 w-10 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Show all technologies"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="max-w-6xl mx-auto py-8 space-y-12">
            {techCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-center text-primary">
                  {category.category}
                </h3>
                
                {category.subcategories ? (
                  <div className="space-y-8">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <div key={subcategory.name} className="space-y-4">
                        <h4 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400 text-center">
                          {subcategory.name}
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
                          {subcategory.items.map((tech, techIndex) => (
                            <motion.div
                              key={tech.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (categoryIndex * 0.1) + (subIndex * 0.05) + (techIndex * 0.03) }}
                            >
                              <TechItem tech={tech} showName={true} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
                    {category.items?.map((tech, techIndex) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (techIndex * 0.03) }}
                      >
                        <TechItem tech={tech} showName={true} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={() => setShowAll(false)}
              className="flex items-center justify-center h-10 w-10 rounded-md border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              title="Back to scrolling view"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
