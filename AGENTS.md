<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep RH forms, navigation and table configuration in `src/features/rh` to share behavior across distinct content routes.
- Read and write private RH data through authenticated server functions and the managed protected-route layout so direct calls validate the session.
- Restrict account creation to administrators in Cloud; bind RH table and Storage access to the protected user_roles authorization, automatically assigning the single RH operator role to administrator-provisioned accounts, to preserve shared company access without unconditional policies.
- Upload attachments through the native private Storage API and store metadata only after successful upload; remove uploads if metadata saving fails.
- Link module attachments through nullable module and record identifiers on document metadata, validated against the employee on the server; this preserves standalone documents and keeps all attachments in one private library.
- Permit Storage inserts and updates only in the caller's own folder; allow authorized RH operators to read and remove their own uploads or files linked by accessible document metadata, preserving shared attachments while isolating unlinked uploads.
- Store monthly benefits on employees and snapshot them on payroll rows; keep benefits separate from net salary so historical reports never change when employee rates change.
- Build payroll history from saved payroll rows and forecasts from active employees in shared RH reporting helpers; label estimates separately from registered and paid amounts to avoid treating projections as actual payments.
