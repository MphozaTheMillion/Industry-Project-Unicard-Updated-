export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--accent) / 0.3) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </main>
  );
}
