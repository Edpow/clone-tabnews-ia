// Silabificação de nomes em português (regras gerais simplificadas).
//
// Regras aplicadas:
// - Dígrafos (ch, lh, nh, rr, ss) e "qu"/"gu" diante de e/i contam como
//   uma única consoante;
// - Consoante isolada entre vogais inicia a sílaba seguinte (Ri-ta);
// - Encontro consonantal: a fronteira cai antes do maior ataque válido
//   (pr, br, tr, dr, cr, gr, fr, fl, pl, cl, gl, bl, vr, vl);
// - Vogais adjacentes ficam juntas apenas quando formam ditongo
//   (pai, mão, mãe); caso contrário é hiato e divide (Lu-a-na);
// - "y" inicial é consoante (Yasmin); no meio do nome é vogal (Ryan).

const VOGAIS = new Set([
  "a",
  "e",
  "i",
  "o",
  "u",
  "á",
  "é",
  "í",
  "ó",
  "ú",
  "â",
  "ê",
  "ô",
  "ã",
  "õ",
]);

const DIGRAFOS_CONSOANTE = new Set(["ch", "lh", "nh", "rr", "ss"]);

const ATAQUES_DE_DOIS = new Set([
  "pr",
  "br",
  "tr",
  "dr",
  "cr",
  "gr",
  "fr",
  "fl",
  "pl",
  "cl",
  "gl",
  "bl",
  "vr",
  "vl",
]);

const LETRA = /[a-zA-ZáéíóúâêôãõçÁÉÍÓÚÂÊÔÃÕÇ]/;

type Unidade = {
  texto: string;
  vogal: boolean;
};

type Nucleo = {
  inicio: number;
  fim: number;
};

function ehVogal(char: string, indice: number): boolean {
  const letra = char.toLowerCase();
  if (letra === "y") return indice > 0; // "Yasmin" (consoante) vs "Ryan" (vogal)
  if (letra === "w") return false;
  return VOGAIS.has(letra);
}

function ehDiphthong(a: string, b: string): boolean {
  const primeira = a.toLowerCase();
  const segunda = b.toLowerCase();
  // Vogal átona à direita: pai, boi, fui, viu, Ryan (y)
  if (segunda === "i" || segunda === "u" || segunda === "y") return true;
  // Ditongos nasais: mãe, mão, põe
  if (primeira === "ã" || primeira === "õ") return true;
  return false;
}

function tokenizar(nome: string): Unidade[] {
  const letras = Array.from(nome);
  const unidades: Unidade[] = [];

  for (let i = 0; i < letras.length; i++) {
    const atual = letras[i];
    if (!LETRA.test(atual)) continue;

    const proxima = letras[i + 1] ?? "";
    const par = (atual + proxima).toLowerCase();
    const aposPar = (letras[i + 2] ?? "").toLowerCase();

    const temProxima = i + 1 < letras.length;
    const ehDigrafo = temProxima && DIGRAFOS_CONSOANTE.has(par);
    const ehQuOuGu =
      i + 2 < letras.length &&
      (par === "qu" || par === "gu") &&
      /^[eiáéíê]/.test(aposPar);

    if (ehDigrafo || ehQuOuGu) {
      unidades.push({ texto: atual + proxima, vogal: false });
      i++;
      continue;
    }

    unidades.push({ texto: atual, vogal: ehVogal(atual, i) });
  }

  return unidades;
}

export function silabificar(nome: string): string[] {
  const unidades = tokenizar(nome);
  if (unidades.length === 0) return [];

  // 1. Agrupa vogais em núcleos: vogais adjacentes só ficam juntas
  //    quando formam ditongo.
  const nucleos: Nucleo[] = [];
  for (let i = 0; i < unidades.length; i++) {
    if (!unidades[i].vogal) continue;
    let fim = i;
    while (
      fim + 1 < unidades.length &&
      unidades[fim + 1].vogal &&
      ehDiphthong(unidades[fim].texto, unidades[fim + 1].texto)
    ) {
      fim++;
    }
    nucleos.push({ inicio: i, fim });
    i = fim;
  }

  // Sem vogais: devolve o conteúdo inteiro como uma única "sílaba".
  if (nucleos.length === 0) {
    return [unidades.map((u) => u.texto).join("")];
  }

  // 2. Decide onde cada sílaba começa.
  const inicios: number[] = [0];
  for (let k = 1; k < nucleos.length; k++) {
    const anterior = nucleos[k - 1];
    const atual = nucleos[k];
    const tamanhoConjunto = atual.inicio - anterior.fim - 1;

    if (tamanhoConjunto === 0) {
      // Hiato: a fronteira fica exatamente entre as vogais.
      inicios.push(atual.inicio);
      continue;
    }

    // Tamanho do ataque da sílaba seguinte: 2 se formar cluster válido
    // (ex.: "dro" em Pedro), senão 1 (ex.: "ta" em Rita).
    let ataque = 1;
    if (tamanhoConjunto >= 2) {
      const parFinal =
        unidades[atual.inicio - 2].texto.toLowerCase() +
        unidades[atual.inicio - 1].texto.toLowerCase();
      if (ATAQUES_DE_DOIS.has(parFinal)) ataque = 2;
    }
    inicios.push(atual.inicio - ataque);
  }

  // 3. Monta as sílabas: cada uma vai do seu início até o início da próxima
  //    (a última vai até o fim, absorvendo as consoantes finais).
  const silabas: string[] = [];
  for (let k = 0; k < nucleos.length; k++) {
    const inicio = inicios[k];
    const fim = k + 1 < nucleos.length ? inicios[k + 1] : unidades.length;
    silabas.push(
      unidades
        .slice(inicio, fim)
        .map((u) => u.texto)
        .join(""),
    );
  }

  return silabas;
}
