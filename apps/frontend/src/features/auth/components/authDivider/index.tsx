export default function AuthDivider() {
  return (
    <div className="flex items-center gap-4 py-1 my-6">
      <span className="h-px flex-1 bg-[var(--landing-border)]" />
      <span className="text-sm text-[var(--landing-muted)]">یا</span>
      <span className="h-px flex-1 bg-[var(--landing-border)]" />
    </div>
  );
}
