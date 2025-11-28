import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Intermediate Microeconomics",
  description: "Course materials for Intermediate Microeconomics",
};

export default function IntermediateMicroeconomicsPage() {
  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="font-bold text-3xl mb-8">Intermediate Microeconomics</h1>
      <div className="prose dark:prose-invert">
        <p>
          <a href="/assets/pdf/returns-to-scale.pdf" className="text-blue-600 hover:underline">
            Notes on returns to scale and marginal returns.
          </a>
        </p>
      </div>
    </section>
  );
}
