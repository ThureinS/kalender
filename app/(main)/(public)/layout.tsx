import PublicNavBar from "@/components/PublicNavBar"
import { StorefrontSurface } from "@/components/layout/product-surfaces"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StorefrontSurface>
      <PublicNavBar />
      <section className="pt-24">{children}</section>
    </StorefrontSurface>
  )
}
