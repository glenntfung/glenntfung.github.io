import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[44rem] flex-col gap-4 px-5 pt-12 pb-4 sm:px-8 sm:pt-16">
      <p className="label">404</p>
      <h1 className="page-title">
        Page not found
      </h1>
      <p className="max-w-[60ch] text-muted">
        That address does not match anything on this site. The{" "}
        <Link href="/blog" className="text-link underline underline-offset-4">
          writing index
        </Link>{" "}
        lists every post.
      </p>
      <p className="text-[0.8125rem]">
        <Link href="/" className="text-link underline-offset-4 hover:underline">
          Go home →
        </Link>
      </p>
    </div>
  );
}
