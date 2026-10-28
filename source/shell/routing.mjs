export const systems = Object.freeze([
  Object.freeze({ id: 'mm-image', label: 'MM Image' }),
  Object.freeze({ id: 'aigc', label: 'AIGC' }),
  Object.freeze({ id: 'video', label: 'Video' }),
]);

export function normalizeChildRoute(route = '/') {
  const value = String(route).replace(/^#/, '');
  return value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export function parseRoute(hash = '') {
  const match = /^#\/(mm-image|aigc|video)(\/.*)?$/.exec(hash);
  return match
    ? { id: match[1], route: normalizeChildRoute(match[2]) }
    : { id: 'mm-image', route: '/' };
}

export function formatRoute(id, route = '/') {
  if (!systems.some(system => system.id === id)) throw new Error(`Unknown design system: ${id}`);
  return `#/${id}${normalizeChildRoute(route)}`;
}

export function nextTabIndex(index, key) {
  if (key === 'ArrowRight') return (index + 1) % systems.length;
  if (key === 'ArrowLeft') return (index + systems.length - 1) % systems.length;
  if (key === 'Home') return 0;
  if (key === 'End') return systems.length - 1;
  return null;
}
