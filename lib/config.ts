// =====================================================================
// iStore Pro — Constantes de configuración legítimas (no mock data).
// Checklist de diagnóstico estándar y plantillas de mensajes automáticos.
// =====================================================================

export const diagnosticChecklistItems: string[] = [
  "Pantalla", "Touch", "Face ID", "Touch ID", "Micrófono", "Bocina",
  "Bluetooth", "WiFi", "Red Celular", "Flash", "Cámara Frontal",
  "Cámara Trasera", "Carga", "Batería", "Sensores", "Botones", "Vibrador",
];

export const autoMessages = [
  { trigger: "Equipo Recibido", template: "Hola {cliente}, recibimos tu {equipo}. Tu folio es {folio}. Te avisaremos del diagnóstico." },
  { trigger: "Diagnóstico Listo", template: "{cliente}, el diagnóstico de tu {equipo} está listo. Costo estimado: {costo}." },
  { trigger: "Esperando Autorización", template: "Necesitamos tu autorización para reparar tu {equipo}. Responde SÍ para continuar." },
  { trigger: "Reparación Terminada", template: "¡Buenas noticias! La reparación de tu {equipo} ha finalizado." },
  { trigger: "Listo para Entrega", template: "Tu {equipo} está listo para recoger. Horario: L-S 9:00–19:00." },
];
