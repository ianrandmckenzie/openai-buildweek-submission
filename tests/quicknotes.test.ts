import { describe, expect, it } from 'vitest';
import { moveCard, sortPinned, toggleChecklist, type QuicknoteCard } from '../src/lib/quicknotes/board';

const cards: QuicknoteCard[] = [{ id: 'a', title: 'A', body: '', pinned: false, checklist: [{ id: 'i', text: 'Check', completed: false }] }, { id: 'b', title: 'B', body: '', pinned: true, checklist: [] }, { id: 'c', title: 'C', body: '', pinned: false, checklist: [] }];

describe('quicknotes board', () => {
  it('toggles one checklist item without changing siblings', () => { const next = toggleChecklist(cards[0], 'i'); expect(next.checklist[0].completed).toBe(true); expect(cards[0].checklist[0].completed).toBe(false); });
  it('moves cards immutably and rejects invalid positions', () => { expect(moveCard(cards, 0, 2).map((card) => card.id)).toEqual(['b', 'c', 'a']); expect(moveCard(cards, -1, 2)).toBe(cards); });
  it('places pinned cards first', () => { expect(sortPinned(cards).map((card) => card.id)).toEqual(['b', 'a', 'c']); });
});
