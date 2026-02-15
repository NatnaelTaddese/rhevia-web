import { SessionProvider } from "@/components/session-provider";
import { Header } from "@/components/explore/header";

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  );
}
