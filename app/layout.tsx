import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Página em Construção — TabNews",
  description:
    "Estamos reconstruindo o TabNews, um lugar na internet para quem trabalha com tecnologia e precisa de conteúdos, com valor concreto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
