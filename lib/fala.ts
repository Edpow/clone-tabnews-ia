// Fala (Web Speech API) em português do Brasil.
//
// Cada chamada "cancela" a fala anterior e recebe um número de geração:
// callbacks de falas antigas são ignorados, evitando que o destaque
// visual seja apagado/atualizado pela fala que já foi interrompida.

type OpcoesFala = {
  aoIniciar?: () => void;
  aoEncerrar?: () => void;
};

type OpcoesSequencia = {
  aoIniciarSilaba?: (indice: number) => void;
  aoEncerrar?: () => void;
};

let geracao = 0;
let vozes: SpeechSynthesisVoice[] = [];

function temSuporte(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

if (temSuporte()) {
  const carregarVozes = () => {
    vozes = window.speechSynthesis.getVoices();
  };
  carregarVozes();
  window.speechSynthesis.addEventListener("voiceschanged", carregarVozes);
}

function vozPortugues(): SpeechSynthesisVoice | null {
  const normalizar = (lang: string) => lang.toLowerCase().replace("_", "-");
  return (
    vozes.find((v) => normalizar(v.lang).startsWith("pt-br")) ??
    vozes.find((v) => normalizar(v.lang).startsWith("pt")) ??
    null
  );
}

function criarUtterance(texto: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  const voz = vozPortugues();
  if (voz) utterance.voice = voz;
  return utterance;
}

function falarUm(texto: string, opcoes: OpcoesFala): void {
  if (!temSuporte()) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  const minhaGeracao = ++geracao;

  const utterance = criarUtterance(texto);
  utterance.onstart = () => {
    if (minhaGeracao === geracao) opcoes.aoIniciar?.();
  };
  const encerrar = () => {
    if (minhaGeracao === geracao) opcoes.aoEncerrar?.();
  };
  utterance.onend = encerrar;
  utterance.onerror = encerrar;

  // Fala em um próximo tick: alguns navegadores ignoram um speak()
  // imediatamente após cancel(). O cheque de geração evita que uma
  // fala antiga agendada ainda seja falada após um novo clique.
  setTimeout(() => {
    if (minhaGeracao !== geracao) return;
    synth.speak(utterance);
  }, 0);
}

export function falar(texto: string, opcoes: OpcoesFala = {}): void {
  falarUm(texto, opcoes);
}

export function falarSequencia(
  textos: string[],
  opcoes: OpcoesSequencia = {},
): void {
  if (!temSuporte()) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  const minhaGeracao = ++geracao;

  const utterances = textos.map((texto, indice) => {
    const utterance = criarUtterance(texto);
    utterance.onstart = () => {
      if (minhaGeracao === geracao) opcoes.aoIniciarSilaba?.(indice);
    };
    const encerrar = () => {
      if (minhaGeracao !== geracao) return;
      if (indice === textos.length - 1) opcoes.aoEncerrar?.();
    };
    utterance.onend = encerrar;
    utterance.onerror = encerrar;
    return utterance;
  });

  setTimeout(() => {
    if (minhaGeracao !== geracao) return;
    utterances.forEach((utterance) => synth.speak(utterance));
  }, 0);
}
