import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "header" | "footer";
  id?: string;
}

/**
 * Global section wrapper.
 * Applies the standard 150px horizontal padding (responsive: 64px tablet, 20px mobile).
 * Use this for every public-facing section on the site.
 */
export default function Section({
  children,
  className,
  as: Tag = "section",
  id,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("section-container", className)}>
      {children}
    </Tag>
  );
}
