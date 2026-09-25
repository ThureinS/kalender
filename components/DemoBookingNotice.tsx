export default function DemoBookingNotice() {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
      <p className="font-medium text-foreground">Demo host · Test bookings only</p>
      <p className="mt-1 leading-6 text-muted-foreground">
        Try the booking flow with this test account. Bookings create real calendar
        events, but no meeting will take place.
      </p>
    </div>
  )
}
