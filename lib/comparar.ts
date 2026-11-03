// Comparação flexível entre o que a criança falou (transcrição do
// reconhecimento de voz) e a sílaba/palavra esperada.
//
// Reconhecimento de sílabas isoladas é impreciso, então aceitamos:
// 1. igualdade exata (após normalizar);
// 2. alguma palavra da transcrição igual ao esperado;
// 3. diferença de até 1 caractere (Levenshtein) — "ry" ≈ "ri";
// 4. palavra que começa com o esperado, se ele tiver >= 3 letras
//    ("len" ≈ "lendo", mas "ta" não aceita "também").

export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function distanciaLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const atual = [i];
    for (let j = 1; j <= b.length; j++) {
      atual[j] = Math.min(
        anterior[j] + 1,
        atual[j - 1] + 1,
        anterior[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    anterior = atual;
  }

  return anterior[b.length];
}

// esperados: formas aceitas do alvo (ex.: ["Ri", "Ry"] ou ["Rian", "Ryan"]).
export function falouCorreto(
  esperados: string[],
  transcricoes: string[],
): boolean {
  const alvos = esperados.map(normalizar).filter(Boolean);

  for (const transcricao of transcricoes) {
    const texto = normalizar(transcricao);
    if (!texto) continue;

    const candidatos = [texto, ...texto.split(" ")];

    for (const alvo of alvos) {
      for (const candidato of candidatos) {
        // 1. igualdade exata
        if (candidato === alvo) return true;

        // 3. diferença de até 1 caractere
        if (
          alvo.length >= 2 &&
          distanciaLevenshtein(candidato, alvo) <= 1
        ) {
          return true;
        }

        // 4. começa com o esperado (só para esperados de >= 3 letras)
        if (alvo.length >= 3 && candidato.startsWith(alvo)) return true;
      }
    }
  }

  return false;
}
