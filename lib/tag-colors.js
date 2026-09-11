// Older records contain invalid values such as "#gray". Keep stored data intact
// and provide a valid color for swatches, badges, and native color inputs.
export function tagColor(value) {
  if (/^#[0-9a-f]{6}$/i.test(value || '')) return value;
  if (/^#[0-9a-f]{3}$/i.test(value || '')) return '#' + value.slice(1).split('').map(char => char + char).join('');
  return '#808080';
}
