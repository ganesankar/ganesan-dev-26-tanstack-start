export function serializeDoc<T = Record<string, unknown>>(doc: FirebaseFirestore.DocumentSnapshot): T | null {
  const data = doc.data()
  if (!data) return null
  const serialized: Record<string, unknown> = { id: doc.id }
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && 'toDate' in value) {
      serialized[key] = (value as { toDate: () => Date }).toDate().toISOString()
    } else {
      serialized[key] = value
    }
  }
  return serialized as T
}

export function serializeDocs<T = Record<string, unknown>>(docs: FirebaseFirestore.DocumentSnapshot[]): T[] {
  return docs.map((doc) => serializeDoc<T>(doc)).filter((d): d is T => d !== null)
}

export function getTimestamp(value: unknown): Date {
  if (!value) return new Date()
  if (typeof value === 'string') return new Date(value)
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate()
  }
  return new Date()
}
