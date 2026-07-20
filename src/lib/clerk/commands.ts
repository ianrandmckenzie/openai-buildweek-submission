export type ClerkCommand =
  | { type: 'open_view'; view: string }
  | { type: 'create_task'; title: string }
  | { type: 'create_note'; content: string }
  | { type: 'message'; content: string };

export type ClerkDraftAction = { type: 'create_task'|'create_note'; payload: Record<string, string> };

export function parseClerkInput(input: string): ClerkCommand {
  const content = input.trim();
  if (!content) throw new Error('Clerk input cannot be empty');
  const [command, ...rest] = content.split(/\s+/); const value = rest.join(' ').trim();
  if (command.toLowerCase() === '/open' && value) return { type: 'open_view', view: value.toLowerCase() };
  if (command.toLowerCase() === '/task' && value) return { type: 'create_task', title: value };
  if (command.toLowerCase() === '/note' && value) return { type: 'create_note', content: value };
  const noteMatch = content.match(/^(?:please\s+)?(?:create|make|add)\s+(?:a\s+)?(?:new\s+)?(?:note|quicknote|doc(?:ument)?)\s+(?:that\s+)?(?:says?|tells?\s+me|about)?\s*(.+)$/i);
  if (noteMatch?.[1]?.trim()) return { type: 'create_note', content: noteMatch[1].trim() };
  const taskMatch = content.match(/^(?:please\s+)?(?:create|make|add)\s+(?:a\s+)?(?:new\s+)?task\s+(?:to\s+)?(.+)$/i);
  if (taskMatch?.[1]?.trim()) return { type: 'create_task', title: taskMatch[1].trim() };
  return { type: 'message', content };
}

export function commandReply(command: ClerkCommand): string {
  switch (command.type) { case 'open_view': return `Opening ${command.view}.`; case 'create_task': return `Drafted task: ${command.title}`; case 'create_note': return `Drafted note: ${command.content}`; default: return ''; }
}

export function draftForCommand(command: ClerkCommand): ClerkDraftAction | undefined {
  if (command.type === 'create_task') return { type: 'create_task', payload: { title: command.title } };
  if (command.type === 'create_note') return { type: 'create_note', payload: { title: 'Untitled quicknote', content: command.content } };
  return undefined;
}
