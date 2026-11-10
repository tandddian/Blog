export default function SharedLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-col gap-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Shared Layout</h1>
      </header>
      {children}
    </div>
  );
}
