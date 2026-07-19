import { describe, expect, it } from 'vitest';
import { ensureQuicknoteId, moveCard, partitionPinned, sortPinned, toggleChecklist, type QuicknoteCard } from '../src/lib/quicknotes/board';

const cards: QuicknoteCard[] = [{ id: 'a', title: 'A', body: '', pinned: false, checklist: [{ id: 'i', text: 'Check', completed: false }] }, { id: 'b', title: 'B', body: '', pinned: true, checklist: [] }, { id: 'c', title: 'C', body: '', pinned: false, checklist: [] }];

describe('quicknotes board', () => {
  it('toggles one checklist item without changing siblings', () => { const next = toggleChecklist(cards[0], 'i'); expect(next.checklist[0].completed).toBe(true); expect(cards[0].checklist[0].completed).toBe(false); });
  it('moves cards immutably and rejects invalid positions', () => { expect(moveCard(cards, 0, 2).map((card) => card.id)).toEqual(['b', 'c', 'a']); expect(moveCard(cards, -1, 2)).toBe(cards); });
  it('places pinned cards first', () => { expect(sortPinned(cards).map((card) => card.id)).toEqual(['b', 'a', 'c']); });
  it('generates unique ids for notes created without ids', () => { const first = ensureQuicknoteId<{ id?: string; title: string }>({ title: 'One' }); const second = ensureQuicknoteId<{ id?: string; title: string }>({ title: 'Two' }); expect(first.id).toBeTruthy(); expect(second.id).toBeTruthy(); expect(first.id).not.toBe(second.id); });
  it('partitions pinned notes into a dedicated section', () => { const sections = partitionPinned(cards); expect(sections.pinned.map((item) => item.id)).toEqual(['b']); expect(sections.other.map((item) => item.id)).toEqual(['a', 'c']); });
});
