# Component Guidelines

## Ownership

Reusable presentation belongs in `src/components/`. Feature-specific workflow
composition remains under the owning feature. Shared UI components contain no
authentication, validation, repository, payment, booking, or appointment
rules.

## Application shell

`AuthenticatedPageShell` supplies the desktop sidebar, mobile drawer, active
navigation, breadcrumb trail, quick booking action, theme switch, Clerk profile
control, page title, and responsive content container. Authenticated feature
pages provide only their title, description, optional actions, and content.

## Content

- Use `Card` for a meaningful grouped surface, not every nested block.
- Use `SectionHeader` for sections below the page-level heading.
- Use `MetricCard` only for repository-backed values or navigation. Never
  fabricate operational totals.
- Use `Alert` or `ActionFeedback` for visible status and failure feedback.
- Use `EmptyState` for a complete empty region.

## Tables

Wrap wide tables in `ResponsiveTable`. Give every region a descriptive label.
Tables retain native table semantics, sticky headers, row hover feedback, and
keyboard-accessible horizontal containment on narrow screens. Page-level
horizontal overflow is not allowed.

## Forms

Use native controls and shared semantic styling. Every control needs an
associated label. Connect help and validation messages with
`aria-describedby`, set `aria-invalid` on invalid controls, announce failures
with `role="alert"`, and announce success with a polite status region. Use
`SubmitButton` for pending form submissions.

Destructive operations use `ConfirmationDialog` before submitting the existing
Server Action form. The dialog changes presentation only and must not duplicate
or replace server-side validation.

## Client boundaries

Server Components remain the default. Client Components are limited to theme,
navigation drawer/sidebar state, confirmation interaction, Clerk browser
controls, and existing action-state forms. Do not add client-side data fetching
or application state libraries.
