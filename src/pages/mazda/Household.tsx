import { motion } from "framer-motion";
import { Sparkles, User, Car, CreditCard, Mail } from "lucide-react";
import { HOUSEHOLD } from "@/lib/mazda-mock";
import { PageHeader, Crumb, AgentDock } from "@/components/MazdaAppShell";

export default function HouseholdPage() {
  const h = HOUSEHOLD;
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Crumb>Customer 360</Crumb>
      <PageHeader
        eyebrow="Stage 1 + Stage 5 · Customer 360 + Trade-Cycle"
        title={h.name}
        description={`Data Cloud key-ring unifies ${h.members.length} drivers, ${h.garage.length} VINs, MFS lease, MyMazda + Owner's Club into one Auto Cloud profile. Trade-cycle propensity ${h.tradeCycle.propensity}.`}
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <section className="rounded border hairline bg-card shadow-card p-6 border-l-4 border-l-primary">
            <div className="text-[10px] uppercase tracking-[0.14em] text-primary mb-1 font-medium">Data Cloud key-ring</div>
            <h2 className="text-xl font-semibold">Household profile</h2>
            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lifetime value</div>
                <div className="text-3xl mt-1">{h.ltv}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active vehicles</div>
                <div className="text-3xl mt-1">{h.garage.filter((g) => g.status.includes("Active")).length}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last engaged</div>
                <div className="text-lg mt-2">{h.marketing.lastEngaged}</div>
              </div>
            </div>
          </section>

          <section>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Members</div>
            <h2 className="text-xl mb-3">Drivers & co-drivers</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {h.members.map((m, i) => (
                <motion.div key={m.email} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded border hairline bg-card p-4">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.email}</div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Garage</div>
            <h2 className="text-xl mb-3">Multi-vehicle history</h2>
            <div className="rounded border hairline bg-card overflow-hidden divide-y divide-border">
              {h.garage.map((g) => (
                <div key={g.vin} className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{g.model}</div>
                    <div className="text-xs text-muted-foreground font-mono">{g.vin}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${g.status.includes("Active") ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>{g.status}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded border hairline bg-card p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Finance</div>
              <h3 className="text-lg mb-3">Mazda Capital</h3>
              {h.finance.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-sm">
                    <div>{f.type} · {f.vehicle}</div>
                    <div className="text-xs text-muted-foreground">{f.remaining} remaining · {f.monthly}/mo</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded border hairline bg-card p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Marketing</div>
              <h3 className="text-lg mb-3">Engagement</h3>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div>{h.marketing.lastEngaged}</div>
                  <div className="text-xs text-muted-foreground">Opt-in: {h.marketing.optIn ? "yes" : "no"}</div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Ask Atlas</div>
            <h2 className="text-xl mb-3">Natural-language Q&A</h2>
            <div className="space-y-3">
              <div className="rounded bg-secondary px-4 py-2.5 text-sm">"What's the lifetime value of the Tanaka household?"</div>
              <div className="rounded bg-secondary border hairline px-4 py-3 text-sm leading-relaxed flex gap-3">
                <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  Tanaka household LTV is <span className="text-primary font-medium">{h.ltv}</span> across 3 vehicles purchased over 5 years, 1 active Mazda Capital lease, and an attached service revenue stream of $4,180/yr. The household is in the top 8% of LTV for the West region. Upsell signal: Kenji (18) likely first-vehicle within 18 months.
                </div>
              </div>
            </div>
          </section>
        </div>
        <aside className="space-y-4"><AgentDock /></aside>
      </div>
    </div>
  );
}