export interface ChecklistItem { id: string; text: string; completed: boolean; }
export interface QuicknoteCard { id: string; title: string; body: string; pinned: boolean; checklist: ChecklistItem[]; }

export function toggleChecklist(card: QuicknoteCard, itemId: string): QuicknoteCard {
  return { ...card, checklist: card.checklist.map((item) => item.id === itemId ? { ...item, completed: !item.completed } : item) };
}

export function moveCard(cards: QuicknoteCard[], fromIndex: number, toIndex: number): QuicknoteCard[] {
  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex < 0 || fromIndex >= cards.length || toIndex < 0 || toIndex >= cards.length) return cards;
  const next = [...cards]; const [moved] = next.splice(fromIndex, 1); next.splice(toIndex, 0, moved); return next;
}

export function sortPinned(cards: QuicknoteCard[]): QuicknoteCard[] { return [...cards].sort((a, b) => Number(b.pinned) - Number(a.pinned)); }
