<script lang="ts">
  import { onMount } from 'svelte';
  import { chartPoints, formatDuration, summarizeProgress, type ProgressLog } from '../progress/metrics';
  export let logs: ProgressLog[] = [];
  export let projectId: string | undefined;
  let period = 30; let now = new Date();
  $: start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - period + 1); $: summary = summarizeProgress(logs, start, now, projectId); $: points = chartPoints(summary.daily, 720, 220);
  onMount(() => { now = new Date(); });
</script>

<div class="progress-view" aria-label="Progress">
  <div class="progress-toolbar"><div><p class="eyebrow">Retrospective performance</p><h4>Progress</h4></div><label>Period <select bind:value={period}><option value={7}>7 days</option><option value={30}>30 days</option><option value={90}>90 days</option></select></label></div>
  <div class="summary-grid"><div class="metric"><span>Total tracked</span><strong>{formatDuration(summary.totalSeconds)}</strong></div><div class="metric"><span>Average active day</span><strong>{formatDuration(summary.averageSeconds)}</strong></div><div class="metric"><span>Active days</span><strong>{summary.activeDays}</strong></div></div>
  <section class="chart-card"><div class="chart-heading"><h5>Daily workload</h5><span>{summary.daily.length ? `${summary.daily.length} data points` : 'No activity in this period'}</span></div>{#if points}<svg viewBox="0 0 720 240" role="img" aria-label="Daily workload chart" preserveAspectRatio="none"><line x1="0" y1="220" x2="720" y2="220" class="axis" /><polyline points={points} transform="translate(0, 10)" class="chart-line" /><polyline points={`${points} 720,220 0,220`} transform="translate(0, 10)" class="chart-area" /></svg>{:else}<div class="empty-chart">Track some time to see your workload trend.</div>{/if}</section>
</div>

<style>
  .progress-view { padding: 1rem; } .progress-toolbar, .chart-heading { display: flex; align-items: center; justify-content: space-between; } .eyebrow { margin: 0; color: var(--text-muted); font-size: .68rem; letter-spacing: .08em; text-transform: uppercase; } h4 { margin: .2rem 0 0; font-size: 1.1rem; } label { color: var(--text-muted); font-size: .75rem; } select { margin-left: .35rem; padding: .4rem; border: 1px solid var(--border-custom); border-radius: .4rem; background: var(--bg-elevated); color: var(--text-main); }
  .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin: 1rem 0; } .metric, .chart-card { padding: 1rem; border: 1px solid var(--border-custom); border-radius: .65rem; background: var(--bg-elevated); } .metric { display: grid; gap: .45rem; } .metric span, .chart-heading span { color: var(--text-muted); font-size: .72rem; } .metric strong { font-size: 1.35rem; }
  .chart-card { min-height: 19rem; } h5 { margin: 0; font-size: .9rem; } svg { width: 100%; height: 15rem; margin-top: 1rem; overflow: visible; } .axis { stroke: var(--border-custom); stroke-width: 1; } .chart-line { fill: none; stroke: var(--accent-primary); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; } .chart-area { fill: var(--accent-secondary); opacity: .55; stroke: none; } .empty-chart { display: grid; place-items: center; min-height: 14rem; color: var(--text-muted); font-size: .85rem; text-align: center; }
  @media (max-width: 600px) { .summary-grid { grid-template-columns: 1fr; } .progress-toolbar { align-items: flex-start; flex-direction: column; gap: .75rem; } }
</style>
