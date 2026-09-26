// Kept independent of framework/provider clients so failure ordering is testable.
export async function completeBooking<T, R>(dependencies: {
  findCompleted: () => Promise<R | undefined>
  reserve: () => Promise<T>
  createCalendarEvent: (reservation: T) => Promise<{ id?: string | null; htmlLink?: string | null }>
  persist: (reservation: T, calendar: { id: string; htmlLink?: string | null }) => Promise<R>
}): Promise<R> {
  const existing = await dependencies.findCompleted()
  if (existing) return existing
  const reservation = await dependencies.reserve()
  // Never release an uncertain reservation automatically: the provider may
  // already have committed. Retry uses the same deterministic Calendar id.
  const calendar = await dependencies.createCalendarEvent(reservation)
  if (!calendar.id) throw new Error("Calendar did not confirm event creation")
  return dependencies.persist(reservation, { ...calendar, id: calendar.id })
}
