export default function empty(value) {
  return (value === undefined || value === null || value === 0 || value === '0' || value.length === 0 || value === false)
}
