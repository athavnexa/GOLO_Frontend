import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext";
import { VoucherProvider } from "./context/VoucherContext";

export const metadata = {
  title: "Golo",
  description: "Best Deals & Offers Near You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative isolate">
        <AuthProvider>
          <VoucherProvider>
            <main className="relative z-10">{children}</main>
          </VoucherProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
