export function classeBadge(prioridade) {
  const nome = prioridade === null || prioridade === undefined ? "" : String(prioridade).trim().toUpperCase();
  if (nome === "BAIXA") {
    return "badge badge--baixa";
  }
  if (nome === "MEDIA") {
    return "badge badge--media";
  }
  if (nome === "ALTA") {
    return "badge badge--alta";
  }
  if (nome === "URGENTE") {
    return "badge badge--urgente";
  }
  return "badge";
}
