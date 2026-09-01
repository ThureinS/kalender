import PrivateNavBar from "@/components/PrivateNavBar"
import {
  AppShellFrame,
  AppShellMain,
  AppShellSurface,
} from "@/components/layout/product-surfaces"

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShellSurface>
      <AppShellFrame className="flex-col lg:flex-row">
        <PrivateNavBar />
        <AppShellMain className="px-0 py-0">{children}</AppShellMain>
      </AppShellFrame>
    </AppShellSurface>
  )
}
