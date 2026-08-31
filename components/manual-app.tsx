"use client"

import { ArrowLeft, ArrowRight, Building2, ChevronRight, Menu, Search, ShieldCheck, User, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { BlockRenderer } from "@/components/block-renderer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { allSections, groups } from "@/lib/manual"
import { cn } from "@/lib/utils"

const audienceBadge = {
  admin: { label: "แอดมิน", className: "bg-primary/15 text-primary", icon: ShieldCheck },
  tenant: { label: "ผู้เช่า", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: User },
  all: { label: "ทั่วไป", className: "bg-muted text-muted-foreground", icon: Building2 },
} as const

export function ManualApp() {
  const [activeId, setActiveId] = useState(allSections[0].id)
  const [query, setQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)
  const contentRef = useRef<HTMLElement>(null)

  const activeIndex = allSections.findIndex((s) => s.id === activeId)
  const active = allSections[activeIndex]
  const prev = allSections[activeIndex - 1]
  const next = allSections[activeIndex + 1]

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return groups
    return groups
      .map((g) => ({
        ...g,
        sections: g.sections.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.nav.toLowerCase().includes(q) ||
            (s.code?.toLowerCase().includes(q) ?? false) ||
            (s.summary?.toLowerCase().includes(q) ?? false),
        ),
      }))
      .filter((g) => g.sections.length > 0)
  }, [query])

  function goTo(id: string) {
    setActiveId(id)
    setMobileOpen(false)
  }

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" })
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }, [activeId])

  const activeBadge = audienceBadge[active.audience]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="เปิดเมนู"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-5" />
        </Button>
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="font-heading text-sm font-semibold sm:text-base">คู่มือระบบ SDMS</p>
            <p className="hidden text-xs text-muted-foreground sm:block">ระบบบริหารจัดการหอพัก</p>
          </div>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        {/* Sidebar - desktop */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-72 shrink-0 flex-col border-r border-border lg:flex">
          <SidebarContent
            filteredGroups={filteredGroups}
            query={query}
            setQuery={setQuery}
            activeId={activeId}
            goTo={goTo}
          />
        </aside>

        {/* Sidebar - mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col border-r border-border bg-sidebar">
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <p className="font-heading font-semibold">สารบัญ</p>
                <Button variant="ghost" size="icon" aria-label="ปิดเมนู" onClick={() => setMobileOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
              <SidebarContent
                filteredGroups={filteredGroups}
                query={query}
                setQuery={setQuery}
                activeId={activeId}
                goTo={goTo}
              />
            </div>
          </div>
        )}

        {/* Main content */}
        <main ref={contentRef} className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12">
          <article className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{active.groupTitle}</span>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground">{active.nav}</span>
            </div>

            <div className="mb-2 flex items-center gap-3">
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", activeBadge.className)}>
                <activeBadge.icon className="size-3.5" />
                {activeBadge.label}
              </span>
              {active.code && (
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {active.code}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{active.title}</h1>
            {active.summary && <p className="mt-3 text-base text-muted-foreground">{active.summary}</p>}

            <hr className="my-8 border-border" />

            <BlockRenderer blocks={active.blocks} />

            {/* Prev / Next */}
            <nav className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
              {prev ? (
                <button
                  onClick={() => goTo(prev.id)}
                  className="group flex flex-col gap-1 rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-accent/50"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowLeft className="size-3.5" /> ก่อนหน้า
                  </span>
                  <span className="font-medium text-foreground group-hover:text-primary">{prev.nav}</span>
                </button>
              ) : (
                <span />
              )}
              {next ? (
                <button
                  onClick={() => goTo(next.id)}
                  className="group flex flex-col items-end gap-1 rounded-xl border border-border p-4 text-right transition-colors hover:border-primary/50 hover:bg-accent/50 sm:col-start-2"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    ถัดไป <ArrowRight className="size-3.5" />
                  </span>
                  <span className="font-medium text-foreground group-hover:text-primary">{next.nav}</span>
                </button>
              ) : (
                <span />
              )}
            </nav>
          </article>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  filteredGroups,
  query,
  setQuery,
  activeId,
  goTo,
}: {
  filteredGroups: typeof groups
  query: string
  setQuery: (v: string) => void
  activeId: string
  goTo: (id: string) => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาหัวข้อ..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-8">
        {filteredGroups.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">ไม่พบหัวข้อที่ค้นหา</p>
        )}
        {filteredGroups.map((group) => {
          const badge = audienceBadge[group.audience]
          return (
            <div key={group.id}>
              <div className="mb-2 flex items-center gap-2 px-3">
                <badge.icon className="size-3.5 text-muted-foreground" />
                <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group.title}</h2>
              </div>
              <ul className="space-y-0.5">
                {group.sections.map((section) => {
                  const isActive = section.id === activeId
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => goTo(section.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        )}
                      >
                        {section.code && (
                          <span
                            className={cn(
                              "font-mono text-[10px]",
                              isActive ? "text-primary" : "text-muted-foreground/60",
                            )}
                          >
                            {section.code}
                          </span>
                        )}
                        <span className="truncate">{section.nav}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
