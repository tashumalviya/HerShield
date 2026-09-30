import emailjs from "@emailjs/browser";

const env = import.meta.env;

// EmailJS template variables: {{to_email}} {{to_name}} {{user_name}} {{map_link}} {{track_link}}
// (Template ke "To Email" field me {{to_email}} likhna hai)
export async function sendSosEmails({ contacts, userName, trackUrl }, mapLink) {
  const results = await Promise.allSettled(
    contacts
      .filter((c) => c.email)
      .map((c) =>
        emailjs.send(
          env.VITE_EMAILJS_SERVICE_ID,
          env.VITE_EMAILJS_TEMPLATE_ID,
          { to_email: c.email, to_name: c.name, user_name: userName, map_link: mapLink, track_link: trackUrl },
          { publicKey: env.VITE_EMAILJS_PUBLIC_KEY }
        )
      )
  );
  return results.filter((r) => r.status === "fulfilled").length;
}
