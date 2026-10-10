import { Krona_One, Inter } from "next/font/google";
import { Suspense } from "react";
import InternalNavigationTracker from "@/components/InternalNavigationTracker";
import "./globals.css";
import AssistantWidget from "@/components/AssistantWidget";
import OrchestrateWebChat from "@/components/OrchestrateWebChat";
import { getCurrentUser } from "@/lib/current-user";

// Assistentes antigos (AssistantWidget aqui, e o painel ReuseAssistant em
// src/app/perfil/PerfilClient.js) ficam escondidos por padrão pra não
// aparecer junto com o web chat oficial da IBM. Nenhum arquivo foi apagado;
// setar essa variável como "true" no .env volta a mostrá-los.
const showLegacyAssistants = process.env.NEXT_PUBLIC_SHOW_LEGACY_ASSISTANTS === "true";

const kronaOne = Krona_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-krona",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${kronaOne.variable} ${inter.variable}`}>
        <Suspense fallback={null}>
          <InternalNavigationTracker />
        </Suspense>
        {children}
        {showLegacyAssistants && (
          <AssistantWidget loggedIn={!!user} enabled={Boolean(process.env.ORCHESTRATE_CHAT_URL && process.env.ORCHESTRATE_APIKEY)} />
        )}
        <OrchestrateWebChat userId={user?.id ?? null} />
      </body>
    </html>
  );
}
