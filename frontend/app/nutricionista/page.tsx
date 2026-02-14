// app/nutricionista/page.tsx
import BodyNutricionista from "./body";

export const metadata = {
  title: 'Painel do Nutricionista - Nutri',
  description: 'Gestão de consultas, agenda e acompanhamento de pacientes.',
}

export default function Page() {
  return <BodyNutricionista />;
}