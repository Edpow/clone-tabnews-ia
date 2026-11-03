// Fala (Web Speech API) em português do Brasil.
//
// Cada chamada "cancela" a fala anterior e recebe um número de geração:
// callbacks de falas antigas são ignorados, evitando que o destaque
// visual seja apagado/atualizado pela fala que já foi interrompida.

type OpcoesFala = {
  aoIniciar?: () => void;
  aoEncerrar?: () => void;
  // Velocidade/ tom da voz (0.6 = modo tartaruga, 0.85 = palavra,
  // 0.75 = sílaba; pitch acima de 1 deixa a voz mais "infantil").
  rate?: number;
  pitch?: number;
};

type OpcoesSequencia = {
  aoIniciarSilaba?: (indice: number) => void;
  aoEncerrar?: () => void;
  rate?: number;
  pitch?: number;
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

function criarUtterance(
  texto: string,
  rate?: number,
  pitch?: number,
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";
  if (rate) utterance.rate = rate;
  if (pitch) utterance.pitch = pitch;
  const voz = vozPortugues();
  if (voz) utterance.voice = voz;
  return utterance;
}

function falarUm(texto: string, opcoes: OpcoesFala): void {
  if (!temSuporte()) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  const minhaGeracao = ++geracao;

  const utterance = criarUtterance(texto, opcoes.rate, opcoes.pitch);
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

// Cancela qualquer fala em andamento sem iniciar outra
// (útil antes de abrir o microfone, para o próprio áudio
// do app não ser captado pelo reconhecimento).
export function cancelarFala(): void {
  if (!temSuporte()) return;
  geracao++;
  window.speechSynthesis.cancel();
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
    const utterance = criarUtterance(texto, opcoes.rate, opcoes.pitch);
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
