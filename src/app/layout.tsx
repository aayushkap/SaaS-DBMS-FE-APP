// src/app/layout.tsx
import "./styles/globals.scss";
import ReduxProvider from "@/store/ReduxProvider";
import QueryClientProviderWrapper from "@/app/api/QueryClientProviderWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>AERO DBMS</title>
      </head>
      <body>
        <QueryClientProviderWrapper>
          <ReduxProvider>{children}</ReduxProvider>
        </QueryClientProviderWrapper>
      </body>
    </html>
  );
}
