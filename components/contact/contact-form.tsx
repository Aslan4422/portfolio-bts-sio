"use client";

import { CheckCircle2, Loader2, Mail, Send, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { site } from "@/content/site";
import { Button, buttonStyles } from "@/components/ui/button";
import {
  CONTACT_LIMITS,
  getFormspreeEndpoint,
  validateContactForm,
  type ContactField,
  type ContactFormInput,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

/** Identifiant Formspree lu dans la variable d'environnement (voir .env.example). */
const ENDPOINT = getFormspreeEndpoint(process.env.NEXT_PUBLIC_FORMSPREE_ID);
const SEND_TIMEOUT_MS = 15_000;

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_FORM: ContactFormInput = { name: "", email: "", subject: "", message: "", honeypot: "" };

const fieldClass = cn(
  "mt-2 block w-full rounded-lg border border-field-line bg-canvas/60 px-3.5 py-2.5 text-fg",
  "placeholder:text-fg-muted/80 transition-colors",
  "focus-visible:border-accent-light focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-light",
  "aria-invalid:border-danger",
);

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

function StatusBox({ tone, children }: { tone: "success" | "error"; children: ReactNode }) {
  const Icon = tone === "success" ? CheckCircle2 : TriangleAlert;
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-4 text-sm leading-relaxed",
        tone === "success" ? "border-accent/40 bg-accent/10 text-fg" : "border-danger/50 bg-danger/10 text-fg",
      )}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", tone === "success" ? "text-accent-light" : "text-danger")} />
      <div>{children}</div>
    </div>
  );
}

/**
 * Formulaire de contact envoyé via Formspree.
 * - Validation en français, champ par champ (voir lib/contact.ts).
 * - Champ piège invisible contre les robots : s'il est rempli, rien n'est envoyé.
 * - États : envoi en cours, succès, erreur (avec l'e-mail en solution de repli).
 */
export function ContactForm() {
  const [values, setValues] = useState<ContactFormInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fieldRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    subject: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  // Sans JavaScript (ou avant son chargement), le navigateur vérifie lui-même les champs
  // obligatoires. Une fois la page prête, la validation en français ci-dessous prend le relais.
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  // Formspree non configuré : on propose directement l'e-mail plutôt qu'un formulaire inutilisable.
  if (!ENDPOINT) {
    return (
      <div className="space-y-4">
        <StatusBox tone="error">
          Le formulaire de contact est momentanément indisponible. Vous pouvez m&apos;écrire directement par
          e-mail.
        </StatusBox>
        <a href={`mailto:${site.contact.email}`} className={buttonStyles({ size: "lg" })}>
          <Mail aria-hidden="true" />
          {site.contact.email}
        </a>
        {process.env.NODE_ENV === "development" && (
          <p className="font-mono text-xs text-fg-muted">
            Aide (visible en local uniquement) : renseignez NEXT_PUBLIC_FORMSPREE_ID dans .env.local, puis
            relancez le serveur.
          </p>
        )}
      </div>
    );
  }

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // « _gotcha » = nom du champ piège attendu par Formspree.
    const key = event.target.name === "_gotcha" ? "honeypot" : event.target.name;
    const next = { ...values, [key]: event.target.value };
    setValues(next);
    // Nouvelle saisie : l'ancien message de succès ou d'erreur disparaît.
    if (status === "error" || status === "success") setStatus("idle");
    // Après une première tentative, les erreurs se mettent à jour pendant la saisie.
    if (submitted) setErrors(validateContactForm(next).errors);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("idle");
    setSubmitted(true);

    const result = validateContactForm(values);
    setErrors(result.errors);

    // Champ piège rempli : probable robot. On n'envoie rien, sans le lui signaler.
    if (result.spam) {
      setValues(EMPTY_FORM);
      setStatus("success");
      return;
    }
    if (!result.valid) {
      const firstInvalid = (["name", "email", "subject", "message"] as const).find((field) => result.errors[field]);
      if (firstInvalid) fieldRefs[firstInvalid].current?.focus();
      return;
    }

    setStatus("submitting");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // _subject : objet de l'e-mail reçu (champ spécial Formspree).
        body: JSON.stringify({ ...result.data, _subject: `Portfolio — ${result.data.subject}` }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Réponse inattendue");
      setValues(EMPTY_FORM);
      setSubmitted(false);
      setStatus("success");
    } catch {
      // Pas de détail technique dans la console : le visiteur voit un message clair.
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  };

  const describedBy = (field: ContactField) => (errors[field] ? `contact-${field}-erreur` : undefined);
  const submitting = status === "submitting";

  return (
    // action + method : sans JavaScript, le formulaire est envoyé directement à Formspree
    // (et jamais dans l'adresse de la page). Avec JavaScript, onSubmit prend le relais.
    <form
      ref={formRef}
      action={ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      aria-label="Formulaire de contact"
      className="relative space-y-5"
    >
      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-fg">
          Nom
        </label>
        <input
          ref={fieldRefs.name}
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={CONTACT_LIMITS.nameMax}
          placeholder="Votre nom"
          value={values.name}
          onChange={onChange}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name")}
          className={fieldClass}
        />
        <FieldError id="contact-name-erreur" message={errors.name} />
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-medium text-fg">
          E-mail
        </label>
        <input
          ref={fieldRefs.email}
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={CONTACT_LIMITS.emailMax}
          placeholder="nom@exemple.fr"
          value={values.email}
          onChange={onChange}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email")}
          className={fieldClass}
        />
        <FieldError id="contact-email-erreur" message={errors.email} />
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-fg">
          Sujet
        </label>
        <input
          ref={fieldRefs.subject}
          id="contact-subject"
          name="subject"
          type="text"
          autoComplete="off"
          required
          maxLength={CONTACT_LIMITS.subjectMax}
          placeholder="Objet de votre message"
          value={values.subject}
          onChange={onChange}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={describedBy("subject")}
          className={fieldClass}
        />
        <FieldError id="contact-subject-erreur" message={errors.subject} />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-fg">
          Message
        </label>
        <textarea
          ref={fieldRefs.message}
          id="contact-message"
          name="message"
          rows={6}
          required
          minLength={CONTACT_LIMITS.messageMin}
          maxLength={CONTACT_LIMITS.messageMax}
          placeholder="Votre message"
          value={values.message}
          onChange={onChange}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message")}
          className={cn(fieldClass, "resize-y")}
        />
        <FieldError id="contact-message-erreur" message={errors.message} />
      </div>

      {/* Objet de l'e-mail reçu quand le formulaire part sans JavaScript (sinon, il reprend le sujet saisi). */}
      <input type="hidden" name="_subject" value="Portfolio — nouveau message" />

      {/* Champ piège : invisible et hors de la navigation clavier. Un humain ne le remplit jamais. */}
      <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
        <label htmlFor="contact-gotcha">Ne pas remplir ce champ</label>
        <input
          id="contact-gotcha"
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.honeypot}
          onChange={onChange}
        />
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 aria-hidden="true" className="motion-safe:animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send aria-hidden="true" />
            Envoyer le message
          </>
        )}
      </Button>

      {/* Information RGPD : à quoi servent les données et à qui elles sont transmises. */}
      <p className="text-xs leading-relaxed text-fg-muted">
        Vos nom, e-mail, sujet et message servent uniquement à vous répondre. Ils sont transmis par le service
        Formspree (États-Unis).{" "}
        <Link
          href="/mentions-legales#donnees-personnelles"
          className="underline decoration-line-strong underline-offset-2 transition-colors hover:text-accent-light"
        >
          En savoir plus sur vos données
        </Link>
        .
      </p>

      {/* Zone annoncée par les lecteurs d'écran quand l'état de l'envoi change. */}
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {submitting && <p className="sr-only">Envoi du message en cours…</p>}
        {status === "success" && (
          <StatusBox tone="success">
            Merci, votre message a bien été envoyé. Je vous répondrai dès que possible.
          </StatusBox>
        )}
        {status === "error" && (
          <StatusBox tone="error">
            L&apos;envoi n&apos;a pas abouti. Vérifiez votre connexion et réessayez, ou écrivez-moi directement à{" "}
            <a
              href={`mailto:${site.contact.email}`}
              className="font-medium text-accent-light underline underline-offset-2"
            >
              {site.contact.email}
            </a>
            .
          </StatusBox>
        )}
      </div>
    </form>
  );
}
