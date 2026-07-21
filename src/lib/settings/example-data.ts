import { PersistentCollection } from '../storage/persistent';
import { Storage } from '../storage/idb';
import { readJsonState, writeJsonState } from '../storage/json-state';
import { loadProjects } from '../projects/state';
import { loadDocuments } from '../documents/state';

const prefix = 'example-space-';
const day = 86_400_000;
const id = (name: string) => `${prefix}${name}`;
const meta = (name: string, now: number) => ({ id: id(name), created_at: now, updated_at: now, deleted_at: null, synced_at: null });

export async function generateExampleData(now = Date.now()): Promise<void> {
  const projects = [{ ...meta('roofing', now), name: 'Cascade Roofing Co.', color: '#2c5f8d' }, { ...meta('studio', now + 1), name: 'Side Door Web Design', color: '#7c3aed' }];
  const stores = ['projects', 'events', 'tasks', 'launchpad_links', 'time_logs'] as const;
  const records: Record<string, Record<string, unknown>[]> = {
    projects,
    events: [{ ...meta('event-site-measure', now + 2), project_id: id('roofing'), title: 'Site measure — Morrison residence', description: 'Measure all roof planes including dormers. Photograph flashing details at valleys and chimneys. Confirm architectural shingle color preference with homeowner (they\'re leaning toward GAF Timberwood HD). Check attic ventilation.', location: '1847 Oak Street, Portland', starts_at: now + day, ends_at: now + day + 90 * 60_000, all_day: false, repeat: 'none', completed: false, source_type: 'manual', read_only: false }, { ...meta('event-client-call', now + 3), project_id: id('studio'), title: 'Discovery call — Harbor & Pine Coffee', description: 'Review their current Wix site pain points. Discuss service area pages, online ordering integration, and mobile-first design. They want to launch before holiday season.', location: 'Zoom call', starts_at: now + 2 * day + 14 * 60 * 60_000, ends_at: now + 2 * day + 15 * 60 * 60_000, all_day: false, repeat: 'none', completed: false, source_type: 'manual', read_only: false }],
    tasks: [{ ...meta('task-followup', now + 4), project_id: id('roofing'), title: 'Follow up on Cedar Street estimate', completed: false, priority: 'high' }, { ...meta('task-assets', now + 5), project_id: id('studio'), title: 'Export logo assets for Harbor & Pine', completed: false, priority: 'normal' }, { ...meta('task-invoice', now + 6), project_id: id('roofing'), title: 'Send final invoice — Henderson re-roof', completed: true, priority: 'normal' }],
    notes: [{ ...meta('note-daily', now + 7), project_id: id('roofing'), title: 'Morning dispatch notes', content: JSON.stringify({ body: 'Call Cedar Street before the 9am site visit. Bring the moisture meter, two architectural shingle samples (Timberwood HD and Seal Armor), and the ladder stabilizer. Check weather radar — rain expected Thursday, so prioritize any open roofs.', checklist: [], pinned: true, archived: false, blurred: false }) }, { ...meta('note-ideas', now + 8), project_id: id('studio'), title: 'Web design ideas', content: JSON.stringify({ body: 'Try a before/after case-study layout for contractor sites: problem, process, proof, next step. Use large hero images with overlay text. Add a "Get a Quote" CTA above the fold. Include Google Reviews widget.', checklist: [], pinned: false, archived: false, blurred: false }) }],
    documents: [{ ...meta('doc-sales-playbook', now + 9), project_id: id('roofing'), title: 'Roofing sales playbook', content: '# Roofing sales playbook\n\n## Before the appointment\n- Review satellite imagery and prior estimates in CRM.\n- Bring samples (3-tab, architectural, premium), moisture meter, and ladder notes.\n- Check permit requirements for the municipality.\n\n## During the visit\nDocument the roof condition clearly with photos. Explain options in plain language—avoid jargon. Show the homeowner exactly where the damage is. Leave them with a clear next step and timeline.\n\n## Follow-up\nSend photos, detailed scope, warranty details (manufacturer + workmanship), and a simple decision date. Follow up within 48 hours if no response.' }],
    launchpad_links: [{ ...meta('link-crm', now + 10), project_id: id('roofing'), title: 'JobNimbus CRM', url: 'https://app.jobnimbus.com/', tags: ['sales', 'daily'], description: 'Lead tracking, estimates, and project management.', pinned: true, archived: false, position: 0 }, { ...meta('link-inspiration', now + 11), project_id: id('studio'), title: 'Awwwards inspiration', url: 'https://www.awwwards.com/', tags: ['design', 'inspiration'], description: 'Award-winning website designs for reference.', pinned: true, archived: false, position: 0 }],
    time_logs: [{ ...meta('log-estimate', now + 12), project_id: id('roofing'), group_id: id('task-followup'), title: 'Follow up on Cedar Street estimate', description: 'Reviewed scope, prepared questions about ventilation upgrade, and called homeowner to discuss timeline.', started_at: now - 75 * 60_000, ended_at: now - 30 * 60_000, duration_seconds: 45 * 60, active: false, paused: false, blurred: false }, { ...meta('log-homepage', now + 13), project_id: id('studio'), group_id: id('log-homepage'), title: 'Harbor & Pine homepage wireframe', description: 'Sketched hero section layout, service area map, and testimonial carousel. Researched competitor coffee shop sites.', started_at: now - 3 * 60 * 60_000, ended_at: now - 2 * 60 * 60_000, duration_seconds: 60 * 60, active: false, paused: false, blurred: false }],
  };
  const add = (store: string, record: Record<string, unknown>) => records[store].push(record);

  // Roofing events - site visits, measurements, crew coordination
  const roofingEventTitles = [
    'Site measure — Thompson residence',
    'Material pickup — GAF shingles',
    'Crew briefing — Cedar Street job',
    'Homeowner consultation — Rivera home',
    'Final inspection — Morrison re-roof',
    'Permit pickup — City Hall',
    'Supplier meeting — ABC Supply',
    'Insurance adjuster meeting — Park Ave',
    'Emergency leak assessment — Oak St',
    'Warranty claim review — Henderson',
    'Subcontractor coordination',
    'Safety equipment inspection'
  ];
  const roofingLocations = [
    '2847 Cedar Street, Portland',
    'ABC Supply Co. warehouse',
    'Job site - Cedar Street',
    '1523 Maple Drive, Beaverton',
    '1847 Oak Street, Portland',
    'Portland Development Center',
    'ABC Supply - Tualatin',
    '3892 Park Avenue, Lake Oswego',
    '921 Oak Street, Portland',
    '1847 Oak Street, Portland',
    'Office conference room',
    'Main warehouse'
  ];
  for (let index = 1; index <= 12; index += 1) {
    add('events', {
      ...meta(`roof-event-${index}`, now + 20 + index),
      project_id: id('roofing'),
      title: roofingEventTitles[index - 1],
      description: 'Roofing project coordination and site management.',
      location: roofingLocations[index - 1],
      starts_at: now + (index + 1) * day + 9 * 60 * 60_000,
      ends_at: now + (index + 1) * day + 10 * 60 * 60_000,
      all_day: false,
      repeat: 'none',
      completed: false,
      source_type: 'manual',
      read_only: false
    });
  }

  // Studio events - client calls, design reviews
  const studioEventTitles = [
    'Discovery call — Bloom Bakery',
    'Design review — Harbor & Pine',
    'Launch prep — Local Law Office'
  ];
  for (let index = 1; index <= 3; index += 1) {
    add('events', {
      ...meta(`studio-event-${index}`, now + 40 + index),
      project_id: id('studio'),
      title: studioEventTitles[index - 1],
      description: 'Web design client meeting and project milestone.',
      location: 'Zoom call',
      starts_at: now + (index + 2) * day + 19 * 60 * 60_000,
      ends_at: now + (index + 2) * day + 20 * 60 * 60_000,
      all_day: false,
      repeat: 'none',
      completed: false,
      source_type: 'manual',
      read_only: false
    });
  }

  // Roofing tasks - sales and operations
  const roofingTaskTitles = [
    'Send estimate — Thompson residence',
    'Order materials — Cedar Street job',
    'Schedule crew — Morrison re-roof',
    'Follow up with insurance adjuster',
    'Update CRM — Rivera consultation',
    'Process warranty claim — Henderson',
    'Order safety equipment',
    'Review subcontractor bids',
    'Update permit applications',
    'Prepare monthly sales report',
    'Schedule final inspections',
    'Archive completed project files'
  ];
  for (let index = 1; index <= 12; index += 1) {
    add('tasks', {
      ...meta(`roof-task-${index}`, now + 60 + index),
      project_id: id('roofing'),
      title: roofingTaskTitles[index - 1],
      completed: index % 5 === 0,
      priority: index % 3 === 0 ? 'high' : 'normal'
    });
  }

  // Studio tasks - design and development
  const studioTaskTitles = [
    'Build homepage hero section — Harbor & Pine',
    'Optimize images — Bloom Bakery',
    'Test mobile navigation — Local Law Office',
    'Write service page copy — Harbor & Pine',
    'Set up hosting — Bloom Bakery',
    'Create logo variations — Local Law Office'
  ];
  for (let index = 1; index <= 6; index += 1) {
    add('tasks', {
      ...meta(`studio-task-${index}`, now + 80 + index),
      project_id: id('studio'),
      title: studioTaskTitles[index - 1],
      completed: false,
      priority: 'normal'
    });
  }

  // Roofing launchpad links - real tools
  const roofingLinks = [
    { title: 'JobNimbus - Active Jobs', url: 'https://app.jobnimbus.com/jobs', tags: ['crm', 'daily'], description: 'Current project pipeline and estimates.', pinned: true },
    { title: 'GAF Product Catalog', url: 'https://www.gaf.com/en-us/products/shingles', tags: ['products', 'reference'], description: 'Shingle specifications and color options.', pinned: false },
    { title: 'ABC Supply Portal', url: 'https://www.abcsupply.com/', tags: ['supplier', 'ordering'], description: 'Material ordering and delivery tracking.', pinned: true },
    { title: 'Portland Permits', url: 'https://www.portlandoregon.gov/bds/article/42598', tags: ['permits', 'city'], description: 'City building permit applications and requirements.', pinned: false },
    { title: 'EagleView Reports', url: 'https://my.eagleview.com/', tags: ['measurements', 'satellite'], description: 'Satellite roof measurements and reports.', pinned: false },
    { title: 'Contractor Calculator', url: 'https://www.contractorcalculator.com/', tags: ['tools', 'estimating'], description: 'Roofing material quantity calculator.', pinned: false },
    { title: 'OSHA Safety Guidelines', url: 'https://www.osha.gov/roofing', tags: ['safety', 'compliance'], description: 'Fall protection and safety standards.', pinned: false },
    { title: 'HomeAdvisor Leads', url: 'https://www.homeadvisor.com/', tags: ['leads', 'marketing'], description: 'Lead generation and customer reviews.', pinned: false }
  ];
  for (let index = 0; index < roofingLinks.length; index += 1) {
    add('launchpad_links', {
      ...meta(`roof-link-${index + 1}`, now + 100 + index),
      project_id: id('roofing'),
      title: roofingLinks[index].title,
      url: roofingLinks[index].url,
      tags: roofingLinks[index].tags,
      description: roofingLinks[index].description,
      pinned: roofingLinks[index].pinned,
      archived: false,
      position: index
    });
  }

  // Studio launchpad links - design tools
  const studioLinks = [
    { title: 'Figma - Harbor & Pine', url: 'https://www.figma.com/', tags: ['design', 'active'], description: 'Main design file for Harbor & Pine website.', pinned: true },
    { title: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', tags: ['hosting', 'deployment'], description: 'Website hosting and deployment.', pinned: true },
    { title: 'Google Fonts', url: 'https://fonts.google.com/', tags: ['fonts', 'resources'], description: 'Web font library and pairing tool.', pinned: false },
    { title: 'Unsplash', url: 'https://unsplash.com/', tags: ['images', 'stock'], description: 'Free high-quality stock photos.', pinned: false },
    { title: 'Coolors', url: 'https://coolors.co/', tags: ['colors', 'design'], description: 'Color palette generator.', pinned: false },
    { title: 'Webflow', url: 'https://webflow.com/', tags: ['cms', 'no-code'], description: 'Visual web design platform.', pinned: false },
    { title: 'TinyPNG', url: 'https://tinypng.com/', tags: ['optimization', 'images'], description: 'Image compression tool.', pinned: false },
    { title: 'GTmetrix', url: 'https://gtmetrix.com/', tags: ['performance', 'testing'], description: 'Website speed and performance testing.', pinned: false },
    { title: 'Namecheap', url: 'https://www.namecheap.com/', tags: ['domains', 'registration'], description: 'Domain registration and DNS management.', pinned: false },
    { title: 'Mailchimp', url: 'https://mailchimp.com/', tags: ['email', 'marketing'], description: 'Email marketing and newsletters.', pinned: false }
  ];
  for (let index = 0; index < studioLinks.length; index += 1) {
    add('launchpad_links', {
      ...meta(`studio-link-${index + 1}`, now + 120 + index),
      project_id: id('studio'),
      title: studioLinks[index].title,
      url: studioLinks[index].url,
      tags: studioLinks[index].tags,
      description: studioLinks[index].description,
      pinned: studioLinks[index].pinned,
      archived: false,
      position: index
    });
  }

  // Roofing time logs - realistic work blocks
  const roofingTimeLogTitles = [
    'Prepare estimate — Thompson residence',
    'Site measurement — Cedar Street',
    'Material takeoff — Morrison job',
    'Customer follow-up call',
    'CRM data entry',
    'Permit application prep',
    'Crew scheduling coordination',
    'Insurance documentation',
    'Supplier price comparison',
    'Safety meeting notes',
    'Warranty claim processing',
    'Monthly report generation',
    'Lead qualification calls',
    'Subcontractor bid review',
    'Project photo organization'
  ];
  const roofingTimeLogDescriptions = [
    'Calculated square footage, prepared material list, and drafted estimate for 2,400 sq ft architectural shingle roof.',
    'Measured all roof planes including dormers, photographed flashing details, and noted ventilation requirements.',
    'Created detailed material breakdown for 3,200 sq ft roof with ice shield, underlayment, and ridge vent.',
    'Discussed estimate options with homeowner, answered questions about warranty and timeline.',
    'Updated job status, added notes from site visit, and scheduled follow-up tasks.',
    'Gathered required documents, filled out application forms, and prepared for city submission.',
    'Coordinated crew availability, confirmed material delivery dates, and updated project timeline.',
    'Compiled photos, measurements, and damage reports for insurance claim submission.',
    'Compared pricing from three suppliers for architectural shingles and underlayment.',
    'Documented safety equipment inspections and crew certifications.',
    'Reviewed warranty terms, gathered installation photos, and submitted claim documentation.',
    'Compiled sales data, job completion rates, and customer satisfaction metrics.',
    'Contacted inbound leads, qualified project scope, and scheduled estimates.',
    'Reviewed three subcontractor proposals, checked references, and compared pricing.',
    'Organized and tagged project photos by address and date for portfolio use.'
  ];
  for (let index = 0; index < 15; index += 1) {
    add('time_logs', {
      ...meta(`roof-log-${index + 1}`, now + 150 + index),
      project_id: id('roofing'),
      group_id: id(`roof-log-group-${Math.ceil((index + 1) / 2)}`),
      title: roofingTimeLogTitles[index],
      description: roofingTimeLogDescriptions[index],
      started_at: now - (index + 1) * 3_600_000,
      ended_at: now - (index + 1) * 3_600_000 + 45 * 60_000,
      duration_seconds: 45 * 60,
      active: false,
      paused: false,
      blurred: false
    });
  }

  // Studio time logs - design and development work
  const studioTimeLogTitles = [
    'Wireframe homepage — Harbor & Pine',
    'Build service pages — Bloom Bakery',
    'Client revision meeting — Local Law Office',
    'Image optimization — Harbor & Pine',
    'Mobile responsive testing',
    'Content migration — Bloom Bakery',
    'SEO research — Local Law Office',
    'Logo design exploration — Harbor & Pine',
    'Hosting setup — Bloom Bakery',
    'Contact form integration'
  ];
  const studioTimeLogDescriptions = [
    'Created low-fidelity wireframes for hero section, services overview, and contact page.',
    'Built out service page templates with consistent layout and call-to-action placement.',
    'Reviewed client feedback, discussed revisions to navigation structure and contact page.',
    'Compressed and optimized 40+ images for web, maintained quality while reducing load time.',
    'Tested all pages on iOS and Android devices, fixed layout issues on small screens.',
    'Migrated blog posts and service descriptions from old WordPress site to new platform.',
    'Researched local keywords, optimized meta titles and descriptions for service pages.',
    'Explored three logo concepts, refined typography and color palette options.',
    'Configured domain DNS, set up SSL certificate, and deployed to production.',
    'Integrated contact form with email notifications and spam protection.'
  ];
  for (let index = 0; index < 10; index += 1) {
    add('time_logs', {
      ...meta(`studio-log-${index + 1}`, now + 190 + index),
      project_id: id('studio'),
      group_id: id(`studio-log-group-${Math.ceil((index + 1) / 2)}`),
      title: studioTimeLogTitles[index],
      description: studioTimeLogDescriptions[index],
      started_at: now - (index + 1) * 2_400_000,
      ended_at: now - (index + 1) * 2_400_000 + 90 * 60_000,
      duration_seconds: 90 * 60,
      active: false,
      paused: false,
      blurred: false
    });
  }

  // Roofing documents - detailed notes
  const roofingDocs = [
    { title: 'Cedar Street project notes', content: '# Cedar Street Re-roof\n\n## Project scope\nComplete tear-off and re-roof of 2,800 sq ft residential property. Architectural shingles with upgraded underlayment.\n\n## Key dates\n- Start: Next Monday\n- Duration: 3-4 days weather permitting\n- Final inspection: Following Friday\n\n## Crew assignments\n- Lead: Mike Torres\n- Crew size: 4\n- Equipment needed: Lift for steep section\n\n## Special considerations\nHomeowner requested gutter guards installed. Coordinate with gutter subcontractor for day 3.' },
    { title: 'Estimate template checklist', content: '# Estimate preparation checklist\n\n## Measurements\n- [ ] Total square footage\n- [ ] Number of planes\n- [ ] Pitch calculations\n- [ ] Waste factor (10-15%)\n\n## Materials\n- [ ] Shingles (type and quantity)\n- [ ] Underlayment\n- [ ] Ice and water shield\n- [ ] Ridge vent\n- [ ] Drip edge\n- [ ] Flashing\n\n## Labor\n- [ ] Tear-off costs\n- [ ] Installation labor\n- [ ] Cleanup and disposal\n- [ ] Permit fees' },
    { title: 'Customer FAQ responses', content: '# Common customer questions\n\n## How long will my roof last?\nArchitectural shingles: 30-50 years with proper ventilation and maintenance.\n\n## Do you offer financing?\nYes, we partner with GreenSky for 0% interest options up to 18 months.\n\n## What about weather delays?\nWe monitor weather closely and will reschedule if conditions are unsafe. You\'ll be notified 24 hours in advance.' },
    { title: 'Supplier contact list', content: '# Preferred suppliers\n\n## ABC Supply - Tualatin\nContact: Dave Martinez\nPhone: 503-555-0142\nHours: 6:30am - 4:30pm M-F\n\n## Beacon Building Products\nContact: Sarah Chen\nPhone: 503-555-0198\nHours: 6am - 4pm M-F\n\n## GAF Technical Support\nPhone: 1-800-ROOF-411' }
  ];
  for (let index = 0; index < roofingDocs.length; index += 1) {
    records.documents.push({
      ...meta(`roof-doc-${index + 1}`, now + 220 + index),
      project_id: id('roofing'),
      title: roofingDocs[index].title,
      content: roofingDocs[index].content,
      tags: ['roofing', index % 2 === 0 ? 'projects' : 'reference'],
      archived: false,
      blurred: false
    });
  }

  // Studio documents - client project notes
  const studioDocs = [
    { title: 'Harbor & Pine brand guidelines', content: '# Harbor & Pine Coffee - Brand Guidelines\n\n## Colors\n- Primary: #2c5f8d (deep blue)\n- Secondary: #f4a261 (warm amber)\n- Neutral: #f8f9fa (off-white)\n\n## Typography\n- Headings: Poppins Bold\n- Body: Open Sans Regular\n\n## Voice\nWarm, inviting, community-focused. Emphasize local sourcing and craftsmanship.' },
    { title: 'Bloom Bakery content plan', content: '# Bloom Bakery - Content Plan\n\n## Homepage\nHero: Fresh-baked goods photo with tagline\nAbout: Family-owned since 2015\nServices: Custom cakes, catering, daily specials\n\n## Pages needed\n- Home\n- Menu\n- About Us\n- Gallery\n- Contact\n- Online Ordering (future phase)' },
    { title: 'Client onboarding checklist', content: '# New client onboarding\n\n## Discovery phase\n- [ ] Initial consultation call\n- [ ] Send questionnaire\n- [ ] Collect brand assets\n- [ ] Review competitor sites\n- [ ] Define project scope\n\n## Contract phase\n- [ ] Send proposal\n- [ ] Collect 50% deposit\n- [ ] Sign contract\n- [ ] Set up project folder\n- [ ] Schedule kickoff meeting' },
    { title: 'Design system components', content: '# Reusable components\n\n## Navigation\n- Sticky header with logo left, links right\n- Mobile hamburger menu\n- Active state indicator\n\n## Buttons\n- Primary: filled with brand color\n- Secondary: outlined\n- Text links: underline on hover\n\n## Cards\n- Image top, content bottom\n- Consistent padding (1.5rem)\n- Subtle shadow on hover' }
  ];
  for (let index = 0; index < studioDocs.length; index += 1) {
    records.documents.push({
      ...meta(`studio-doc-${index + 1}`, now + 250 + index),
      project_id: id('studio'),
      title: studioDocs[index].title,
      content: studioDocs[index].content,
      tags: ['design', index % 2 === 0 ? 'clients' : 'templates'],
      archived: false,
      blurred: false
    });
  }
  const storage = new Storage();
  for (const store of stores) { const collection = new PersistentCollection(store, storage); for (const record of records[store]) { const existing = await storage.get(store, record.id as string); if (existing) await collection.update({ ...existing, ...record } as never); else await collection.create(record as never); } }
  const existingDocs = readJsonState<any[]>('dashboard.documents.v1', []);
  const examples = [...records.notes, ...records.documents].map((record) => ({ ...record, tags: record.id === id('doc-sales-playbook') ? ['sales', 'process'] : ['ideas'], archived: false, blurred: false }));
  writeJsonState('dashboard.documents.v1', [...existingDocs.filter((record) => !String(record.id).startsWith(prefix)), ...examples]);
  const existingTimeLogs = readJsonState<Record<string, unknown>[]>('dashboard.time-logs.v1', []);
  writeJsonState('dashboard.time-logs.v1', [...existingTimeLogs.filter((record) => !String(record.id).startsWith(prefix)), ...records.time_logs]);
  writeJsonState('dashboard.routines.v1', [{ id: id('routine-dispatch'), project_id: id('roofing'), title: 'Prepare tomorrow’s route', description: 'Review appointments, weather, and materials.', frequency: 'daily', interval: 1, weekdays: [], ordinals: [], blurred: false, archived: false, last_completed_at: null }, { id: id('routine-studio'), project_id: id('studio'), title: 'Studio cleanup', description: 'Capture loose design ideas and close open tabs.', frequency: 'weekly', interval: 1, weekdays: [0], ordinals: [], blurred: false, archived: false, last_completed_at: null }]);
  await loadProjects();
  await loadDocuments(false);
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('deskclerk:time-logs-changed'));
}
