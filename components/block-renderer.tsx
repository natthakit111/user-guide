import { AlertTriangle, CheckCircle2, Info, Lightbulb } from "lucide-react"
import type { Block } from "@/lib/manual"
import { ImagePlaceholder } from "@/components/image-placeholder"
import { cn } from "@/lib/utils"

const calloutConfig = {
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100",
    iconClass: "text-amber-600 dark:text-amber-400",
    label: "ข้อควรระวัง",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    label: "ผลลัพธ์",
  },
  info: {
    icon: Info,
    className: "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100",
    iconClass: "text-sky-600 dark:text-sky-400",
    label: "ควรรู้",
  },
  tip: {
    icon: Lightbulb,
    className: "border-violet-500/30 bg-violet-500/10 text-violet-900 dark:text-violet-100",
    iconClass: "text-violet-600 dark:text-violet-400",
    label: "เคล็ดลับ",
  },
} as const

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 leading-relaxed">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "lead":
            return (
              <p key={i} className="text-base text-foreground/90 sm:text-lg">
                {block.text}
              </p>
            );
          case "p":
            return (
              <p key={i} className="text-[15px] text-foreground/80">
                {block.text}
              </p>
            );
          case "subheading":
            return (
              <h3
                key={i}
                className="font-heading pt-3 text-lg font-semibold text-foreground"
              >
                {block.text}
              </h3>
            );
          case "list":
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex gap-3 text-[15px] text-foreground/80"
                  >
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/60"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "steps":
            return (
              <ol key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {j + 1}
                    </span>
                    <span className="pt-0.5 text-[15px] text-foreground/85">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "callout": {
            const config = calloutConfig[block.variant];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className={cn(
                  "flex gap-3 rounded-xl border px-4 py-3.5",
                  config.className,
                )}
              >
                <Icon
                  className={cn("mt-0.5 size-5 shrink-0", config.iconClass)}
                  aria-hidden="true"
                />
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
                    {config.label}
                  </p>
                  <p className="text-[15px] leading-relaxed">{block.text}</p>
                </div>
              </div>
            );
          }
          case "table":
            return (
              <div
                key={i}
                className="overflow-x-auto rounded-xl border border-border"
              >
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {block.head.map((h, j) => (
                        <th
                          key={j}
                          className="px-4 py-3 font-heading font-semibold text-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className="border-t border-border">
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-4 py-3 align-top text-foreground/80"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "image":
            return (
              <ImagePlaceholder
                key={i}
                caption={block.caption}
                src={block.src}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  )
}
