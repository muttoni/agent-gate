export const metadata = {
  title: 'agent-gate',
  description: 'agent-only gate (humans can’t pass by hand)'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'ui-sans-serif, system-ui', margin: 24, lineHeight: 1.45 }}>
        {children}
      </body>
    </html>
  );
}
