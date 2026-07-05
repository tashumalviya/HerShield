export const AI_RESPONSES = {
  default: "I'm HerShield AI, your personal safety assistant. How can I help you stay safe today?",
  sos: "🚨 SOS mode activated! Sharing your location with emergency contacts. Stay calm, help is on the way. Call 112 for immediate police assistance.",
  route: "I suggest taking the well-lit main road via MG Road. Avoid the underpass near Park Street after 8 PM. Current safety rating: 4.2/5 ⭐",
  tip: "💡 Safety Tip: Share your live location with a trusted contact before traveling at night. Use HerShield's check-in feature every 30 minutes.",
  help: "I can help you with: Safe route suggestions, Emergency contacts, SOS alerts, Safety tips, Nearby police stations, Community safety reports.",
  hindi: "नमस्ते! मैं HerShield AI हूँ। आपकी सुरक्षा के लिए यहाँ हूँ। कृपया बताइए आपको क्या सहायता चाहिए?",
};

export function getAIResponse(msg) {
  const l = msg.toLowerCase();
  if (l.includes("sos") || l.includes("emergency") || l.includes("help")) return AI_RESPONSES.sos;
  if (l.includes("route") || l.includes("way") || l.includes("road")) return AI_RESPONSES.route;
  if (l.includes("tip") || l.includes("advice") || l.includes("safe")) return AI_RESPONSES.tip;
  if (l.includes("hindi") || l.includes("हिंदी") || l.includes("namaste")) return AI_RESPONSES.hindi;
  if (l.includes("what") || l.includes("how") || l.includes("can")) return AI_RESPONSES.help;
  return "I understand your concern. In case of emergency, press the SOS button immediately. I'm here 24/7.";
}
