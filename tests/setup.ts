import 'fake-indexeddb/auto';

if (typeof document === 'undefined') {
  const attributes = new Map<string, string>();
  const styles = new Map<string, string>();
  const root = {
    dataset: {} as Record<string, string>,
    classList: { add: (...names: string[]) => names.forEach((name) => attributes.set(name, '')), remove: (...names: string[]) => names.forEach((name) => attributes.delete(name)), contains: (name: string) => attributes.has(name) },
    style: {
      setProperty: (name: string, value: string) => styles.set(name, value),
      getPropertyValue: (name: string) => styles.get(name) ?? '',
    },
    removeAttribute: (name: string) => { attributes.delete(name); if (name === 'style') styles.clear(); },
  };
  (globalThis as any).document = { documentElement: root };
}
