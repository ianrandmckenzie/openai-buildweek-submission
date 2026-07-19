import { beforeEach, describe, expect, it } from 'vitest';
import { parseClerkInput } from '../src/lib/clerk/commands';
import { clerkMessages, clearClerkHistory, submitClerkInput } from '../src/lib/clerk/state';

describe('Clerk command processor', () => {
  it('recognizes workspace commands', () => { expect(parseClerkInput('/open calendar')).toEqual({ type: 'open_view', view: 'calendar' }); expect(parseClerkInput('/task Send the proposal')).toEqual({ type: 'create_task', title: 'Send the proposal' }); expect(parseClerkInput('/note Remember this')).toEqual({ type: 'create_note', content: 'Remember this' }); });
  it('preserves plain-language input as a message', () => { expect(parseClerkInput('What should I focus on?')).toEqual({ type: 'message', content: 'What should I focus on?' }); expect(() => parseClerkInput('   ')).toThrow(); });
});

describe('Clerk state engine', () => {
  beforeEach(() => clearClerkHistory());
  it('appends user and Clerk response messages', () => { submitClerkInput('/task Review build week'); let messages: any[] = []; const unsubscribe = clerkMessages.subscribe((value) => { messages = value; }); expect(messages).toHaveLength(2); expect(messages[0].role).toBe('user'); expect(messages[1].role).toBe('clerk'); unsubscribe(); });
});
