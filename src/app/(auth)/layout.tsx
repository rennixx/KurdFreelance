import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Simple header with logo only */}
      <header className="py-6 px-6">
        <Link href="/" className="flex items-center justify-center">
          <img src="/logo.png" alt="KurdFreelance" className="h-16 w-auto" />
        </Link>
      </header>

      {/* Auth content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>
      
      {/* Simple footer */}
      <footer className="py-4 px-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KurdFreelance. All rights reserved.
      </footer>
    </div>
  );
}
