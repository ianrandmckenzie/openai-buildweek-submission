export type ClerkCommand =
  | { type: 'open_view'; view: string }
  | { type: 'create_task'; title: string }
  | { type: 'create_note'; content: string }
  | { type: 'message'; content: string };

export function parseClerkInput(input: string): ClerkCommand {
  const content = input.trim();
  if (!content) throw new Error('Clerk input cannot be empty');
  const [command, ...rest] = content.split(/\s+/); const value = rest.join(' ').trim();
  if (command.toLowerCase() === '/open' && value) return { type: 'open_view', view: value.toLowerCase() };
  if (command.toLowerCase() === '/task' && value) return { type: 'create_task', title: value };
  if (command.toLowerCase() === '/note' && value) return { type: 'create_note', content: value };
  return { type: 'message', content };
}

export function commandReply(command: ClerkCommand): string {
  switch (command.type) { case 'open_view': return `Opening ${command.view}.`; case 'create_task': return `Drafted task: ${command.title}`; case 'create_note': return 'Drafted a new quicknote.'; default: return 'I saved that to your Clerk context.'; }
}
