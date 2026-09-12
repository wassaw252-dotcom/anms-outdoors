import './globals.css';

export const metadata = {
  title: "ANM's OUTDOORS Fulfillment",
  description: 'Shopee fulfillment dashboard for ANM\'s OUTDOORS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
