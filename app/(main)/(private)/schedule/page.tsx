// This code defines a `SchedulePage` component that is responsible for rendering a user's schedule page. It first checks if the user is authenticated using Clerk's authentication system; if not, the user is redirected to the sign-in page. Then, it queries the database for the user's schedule, including any availability information associated with it. Once the schedule data is retrieved, it renders the page within a card layout, displaying a title and a `ScheduleForm` component populated with the user's schedule. This allows the user to view and possibly manage their schedule on the page.

import { ScheduleForm } from "@/components/forms/ScheduleForm"
import { AppPageHeader } from "@/components/layout/product-surfaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSchedule } from "@/server/actions/schedule"
import { auth } from "@clerk/nextjs/server"


// Default export function for the SchedulePage component
export default async function SchedulePage() {
    // Check if the user is authenticated (using Clerk authentication)
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn() // Redirect to sign-in page if user is not authenticated

    // Query the database to fetch the user's schedule based on the authenticated user
    const schedule = await getSchedule(userId)

    return (
        <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <AppPageHeader
                eyebrow="Workspace"
                title="Availability"
                description="Set the weekly windows people can book."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Hours</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScheduleForm schedule={schedule} />
                </CardContent>
            </Card>
        </section>
    )


}
