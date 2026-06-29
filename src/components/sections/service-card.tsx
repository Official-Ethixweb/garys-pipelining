import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ServiceBadge } from "@/components/ui/service-badge";
import type { Service } from "@/lib/content/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="surface-card surface-card-hover group relative flex h-full flex-col justify-between overflow-hidden !border-2 !border-border p-7 transition-colors duration-300 hover:!border-primary"
    >
      {service.featured && (
        <span className="absolute right-7 top-7 inline-flex items-center rounded-full bg-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-foreground lg:right-10 lg:top-10">
          Popular
        </span>
      )}
      <div>
        <div className="flex items-center">
          <ServiceBadge name={service.icon} className="h-[4.55rem] w-[4.55rem] transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h3 className="mt-6 text-2xl tracking-tight text-ink">{service.name}</h3>
        <p className="mt-3 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">{service.shortDescription}</p>
      </div>
      <div className="mt-6">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          Learn more
          <span className="grid h-7 w-7 place-items-center rounded-full border border-border-strong text-foreground transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}
