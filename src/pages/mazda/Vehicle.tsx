import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Battery, AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { VEHICLE, FLEET_DTC_TREND } from "@/lib/mazda-mock";
import { PageHeader, Crumb, AgentDock } from "@/components/MazdaAppShell";
import { usePersona } from "@/lib/persona-context";

export default function VehiclePage() {
  const { persona } = usePersona();
  const isPartner = persona === "partner";
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Crumb>Vehicle 360</Crumb>
      <PageHeader
        eyebrow="Stage 4 · Ownership & Connected Vehicle"
        title={VEHICLE.model}
        description={`VIN ${VEHICLE.vin} · ${VEHICLE.color} · ${VEHICLE.owner}`}
        actions={
          <Link to="/warranty" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
            Open warranty draft <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="rounded border hairline bg-card shadow-card p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-l-4 border-l-primary">
            <Stat label="Mileage" value={VEHICLE.mileage.toLocaleString()} />
            <Stat label="Battery SoH" value={`${VEHICLE.battery.soh}%`} icon={Battery} />
            <Stat label="In service since" value={VEHICLE.inService} />
            <Stat label="Warranty (MGWS)" value={VEHICLE.warranty.type} sub={`Through ${VEHICLE.warranty.expires}`} icon={ShieldCheck} />
            <Stat label="CV Subscription" value={VEHICLE.cvSubscription.status} sub={`${VEHICLE.cvSubscription.plan} · renews ${VEHICLE.cvSubscription.renewsOn}`} />
            <Stat label="Open Recall" value={VEHICLE.openCampaign.id} sub={VEHICLE.openCampaign.desc} icon={AlertTriangle} />
          </div>

          <section className="rounded border hairline bg-card overflow-hidden">
            <div className="p-5 border-b hairline">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Connected vehicle stream</div>
              <h2 className="text-xl mt-1">Diagnostic trouble codes</h2>
            </div>
            <div className="divide-y divide-border">
              {VEHICLE.dtc.map((d, i) => (
                <motion.div key={d.code} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="p-5 flex items-start gap-4">
                  <div className={`h-9 w-9 rounded flex items-center justify-center flex-shrink-0 ${d.severity === "Med" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-medium">{d.code}</code>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border hairline text-muted-foreground">{d.severity}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{d.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                    {d.code === "P0420" && (
                      <div className="mt-3 rounded border border-primary/30 bg-accent p-3 flex gap-2 text-xs">
                        <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span>
                          Atlas matched this DTC to your powertrain warranty and{" "}
                          <Link to="/warranty" className="text-primary underline">drafted a claim</Link> with parts, labor codes, and policy match.
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">History</div>
            <h2 className="text-xl mt-1 mb-4">Service & ownership timeline</h2>
            <div className="space-y-4">
              {VEHICLE.history.map((h, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{h.date}</div>
                  <div className="border-l hairline pl-4 pb-2 flex-1">
                    <div className="text-sm font-medium">{h.event}</div>
                    <div className="text-xs text-muted-foreground">{h.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isPartner && (
            <section className="rounded border border-primary/30 bg-accent p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Partner view · Denso Powertrain</div>
              <h2 className="text-xl mt-1 mb-1">Fleet trend · DTC P0420 · catalyst component</h2>
              <p className="text-xs text-muted-foreground mb-4">Aggregated across all 2024 CX-50 VINs in the field.</p>
              <div className="flex items-end gap-2 h-32">
                {FLEET_DTC_TREND.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-soul rounded-t" style={{ height: `${(m.count / 142) * 100}%` }} />
                    <div className="text-[10px] text-muted-foreground">{m.month}</div>
                    <div className="text-[10px]">{m.count}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">Request engineering review</button>
                <button className="px-3 py-1.5 rounded border hairline text-xs text-muted-foreground hover:text-foreground">Export VIN list (CSV)</button>
              </div>
            </section>
          )}
        </div>
        <aside className="space-y-4"><AgentDock /></aside>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="text-xl mt-1">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}