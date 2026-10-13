import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-6 border-t border-[#E8DDBB] px-4 py-5 text-sm text-[#625D4C] sm:px-6 lg:px-7">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>© DevLife · Shahbaj Khan</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="https://github.com/ShahbajKhan05"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-1 font-semibold hover:text-[#785C19]"
          >
            GitHub
            <ExternalLink aria-hidden="true" size={14} />
          </Link>
          <Link
            href="/#top"
            className="inline-flex min-h-10 items-center gap-1 font-semibold hover:text-[#785C19]"
          >
            Back to top
            <ArrowUp aria-hidden="true" size={15} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
