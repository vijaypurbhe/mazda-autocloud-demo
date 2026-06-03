import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import { LEADS, PIPELINE_STAGES } from "@/lib/mazda-mock";
import { PageHeader, Crumb, AgentDock } from "@/components/MazdaAppShell";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Crumb>Lead Routing</Crumb>
      <PageHeader
        eyebrow="Stage 2 · Digital Retail → Dealer Handoff"
        title="Inbound leads — West region"
        description="MazdaUSA configurator, Cox / Dealer.com, CarNow, and AutoFi leads land in Auto Cloud Lead Mgmt. Einstein scores prioritize, MNAO SLAs escalate, Atlas drafts the next dealer touch."
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <section>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Opportunity pipeline</div>
            <h2 className="text-xl mb-3">Stages with agent prompts</h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {PIPELINE_STAGES.map((stage, i) => {
                const count = LEADS.filter((l) => l.stage === stage).length;
                return (
                  <div key={stage} className="rounded border hairline bg-card p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{`Stage ${i + 1}`}</div>
                    <div className="text-sm font-medium mt-1">{stage}</div>
                    <div className="text-2xl mt-2">{count}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded border hairline bg-card overflow-hidden">
            <div className="p-5 border-b hairline flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Live lead queue</div>
                <h2 className="text-xl mt-1">Inbound leads · West region</h2>
              </div>
              <button className="text-xs px-3 py-1.5 rounded border hairline text-muted-foreground hover:text-foreground">Filter</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Lead</th>
                    <th className="text-left px-4 py-2 font-medium">Customer</th>
                    <th className="text-left px-4 py-2 font-medium">Model</th>
                    <th className="text-left px-4 py-2 font-medium">Dealer</th>
                    <th className="text-left px-4 py-2 font-medium">Score</th>
                    <th className="text-left px-4 py-2 font-medium">Stage</th>
                    <th className="text-left px-4 py-2 font-medium">SLA</th>
                    <th className="text-right px-4 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((l, i) => (
                    <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-t hairline hover:bg-secondary/20">
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{l.id}</td>
                      <td className="px-4 py-3 font-medium">{l.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.model}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.dealer}</td>
                      <td className="px-4 py-3"><ScoreChip score={l.score} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{l.stage}</td>
                      <td className="px-4 py-3"><SLAChip status={l.sla} aged={l.aged} /></td>
                      <td className="px-4 py-3 text-right">
                        <button className="inline-flex items-center gap-1 text-xs text-primary hover:text-foreground">
                          <Sparkles className="h-3 w-3" /> Draft touch
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="space-y-4">
          <AgentDock />
          <div className="rounded border hairline bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Closed-loop</div>
            <div className="text-xl mt-1">Test-drive → sale conversion</div>
            <div className="mt-4 space-y-2">
              {[{ d: "Galpin Mazda", v: 41 }, { d: "Browning Mazda", v: 36 }, { d: "Puente Hills", v: 33 }, { d: "South Coast", v: 28 }].map((row) => (
                <div key={row.d} className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">{row.d}</span>
                    <span>{row.v}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-soul" style={{ width: `${row.v * 2}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScoreChip({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-success/10 text-success" : score >= 75 ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground";
  return <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", tone)}>{score}</span>;
}

function SLAChip({ status, aged }: { status: string; aged: string }) {
  const tone = status === "Breached" ? "text-destructive" : status === "Watch" ? "text-warning" : "text-success";
  return (
    <div className={cn("flex items-center gap-1 text-xs", tone)}>
      <Clock className="h-3 w-3" />
      <span>{status}</span>
      <span className="text-muted-foreground">· {aged}</span>
    </div>
  );
}