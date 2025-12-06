"use client";

import { useState } from "react";

const tech = [
  { group: "Scientific Computing & Analytics", items: ["Python", "Julia", "R", "MATLAB", "C++", "TensorFlow", "PyTorch", "JAX", "Scikit-learn", "NumPy", "Pandas"] },
  { group: "Web & Apps", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js"] },
  { group: "DevOps & Tools", items: ["Git", "GitHub", "Docker", "Bash", "VS Code", "Jupyter"] },
];

export default function TechStack() {
  const [showAll, setShowAll] = useState(false);
  const condensed = tech.flatMap(t => t.items).slice(0, 10);

  return (
    <div className="border rounded-lg p-6 bg-card space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Tech stack</h2>
          <p className="text-sm text-neutral-500">Tools I use most</p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-accent hover:underline"
        >
          {showAll ? "Show less" : "Show all"}
        </button>
      </div>

      {!showAll ? (
        <div className="flex flex-wrap gap-2">
          {condensed.map(item => (
            <span key={item} className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {tech.map(section => (
            <div key={section.group} className="space-y-2">
              <div className="text-sm font-semibold text-primary">{section.group}</div>
              <div className="flex flex-wrap gap-2">
                {section.items.map(item => (
                  <span key={item} className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
