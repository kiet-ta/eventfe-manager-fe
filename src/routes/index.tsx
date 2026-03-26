import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-2 text-xl font-semibold">Project is ready</h2>
      <p className="mb-4 text-muted-foreground">
        Sample/demo code has been removed. You can now start implementing the
        Event Manager features.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Add your domain routes in <code>src/routes</code></li>
        <li>Create shared components in <code>src/components</code></li>
        <li>Use TanStack Query for server state when needed</li>
      </ul>
    </section>
  )
}
