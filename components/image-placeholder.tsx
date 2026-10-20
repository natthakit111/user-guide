import Image from "next/image";
import { ImageIcon } from "lucide-react";

export function ImagePlaceholder({
  caption,
  src,
}: {
  caption: string;
  src?: string;
}) {
  if (src) {
    return (
      <figure className="my-6">
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto block w-fit max-w-full overflow-hidden rounded-xl border border-border bg-muted/20"
        >
          <Image
            src={src}
            alt={caption}
            width={1200}
            height={700}
            className="h-auto max-h-[75vh] w-auto max-w-full"
          />
        </a>
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption} · แตะที่ภาพเพื่อดูขนาดเต็ม
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-6">
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
          <ImageIcon className="size-6" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          พื้นที่สำหรับใส่ภาพหน้าจอ
        </p>
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
