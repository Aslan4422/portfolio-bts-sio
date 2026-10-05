// @vitest-environment jsdom
/*
 * Formulaire de contact testé « pour de vrai » dans un faux navigateur (jsdom) :
 * un visiteur simulé tape au clavier et clique, et l'on vérifie ce qui s'affiche
 * et ce qui part (ou ne part pas !) vers Formspree. Aucun message réel n'est envoyé :
 * la fonction d'envoi (fetch) est remplacée par une fausse.
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Identifiant Formspree de test, défini AVANT le chargement du formulaire (il est lu au démarrage).
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_FORMSPREE_ID = "formulairetest";
});

import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/content/site";

const ENDPOINT = "https://formspree.io/f/formulairetest";

type Deferred = { resolve: (response: Response) => void; reject: (error: unknown) => void };

function setup() {
  const user = userEvent.setup();
  const view = render(<ContactForm />);
  const field = {
    name: screen.getByLabelText("Nom"),
    email: screen.getByLabelText("E-mail"),
    subject: screen.getByLabelText("Sujet"),
    message: screen.getByLabelText("Message"),
    honeypot: view.container.querySelector<HTMLInputElement>('input[name="_gotcha"]')!,
  };
  const submit = () => user.click(screen.getByRole("button", { name: /envoyer le message/i }));
  const fillValid = async () => {
    await user.type(field.name, "Camille Martin");
    await user.type(field.email, "camille@exemple.fr");
    await user.type(field.subject, "Proposition de stage");
    await user.type(field.message, "Bonjour, votre profil m'intéresse.");
  };
  return { user, field, submit, fillValid, form: view.container.querySelector("form")! };
}

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});

describe("Affichage", () => {
  it("présente les 4 champs avec leur étiquette et le bouton d'envoi", () => {
    const { field } = setup();
    for (const input of [field.name, field.email, field.subject, field.message]) expect(input).toBeRequired();
    expect(field.email).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: /envoyer le message/i })).toBeEnabled();
  });

  it("envoie directement à Formspree même sans JavaScript (action + POST)", () => {
    const { form } = setup();
    expect(form).toHaveAttribute("action", ENDPOINT);
    expect(form).toHaveAttribute("method", "POST");
  });

  it("sans JavaScript, laisse le navigateur vérifier les champs ; avec, prend le relais en français", () => {
    // Page générée sur le serveur : pas de « novalidate », le navigateur bloque un formulaire incomplet.
    expect(renderToString(<ContactForm />)).not.toMatch(/novalidate/i);
    // Une fois la page chargée : la validation en français remplace celle du navigateur.
    const { form } = setup();
    expect(form.noValidate).toBe(true);
  });

  it("explique à quoi servent les données (RGPD), avec un lien vers les mentions légales", () => {
    setup();
    expect(screen.getByText(/servent uniquement à vous répondre/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /en savoir plus sur vos données/i })).toHaveAttribute(
      "href",
      "/mentions-legales#donnees-personnelles",
    );
  });
});

describe("Champs vides ou mal remplis", () => {
  it("affiche une erreur par champ, place le curseur sur le premier, et n'envoie rien", async () => {
    const { field, submit } = setup();
    await submit();

    // Chaque champ est marqué invalide et relié à SON message (lu par les lecteurs d'écran).
    const expected = {
      name: "Indiquez votre nom.",
      email: "Indiquez votre adresse e-mail.",
      subject: "Indiquez le sujet de votre message.",
      message: "Écrivez votre message.",
    } as const;
    for (const key of ["name", "email", "subject", "message"] as const) {
      expect(field[key]).toHaveAttribute("aria-invalid", "true");
      expect(field[key]).toHaveAccessibleDescription(expected[key]);
    }
    expect(field.name).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuse un e-mail mal formé et place le curseur dessus", async () => {
    const { user, field, submit, fillValid } = setup();
    await fillValid();
    await user.clear(field.email);
    await user.type(field.email, "camille.exemple.fr");
    await submit();

    expect(field.email).toHaveAttribute("aria-invalid", "true");
    expect(field.email).toHaveAccessibleDescription(/ne semble pas valide/);
    expect(field.email).toHaveFocus();
    // Les champs corrects ne sont pas signalés.
    for (const input of [field.name, field.subject, field.message]) {
      expect(input).not.toHaveAttribute("aria-invalid");
      expect(input).not.toHaveAttribute("aria-describedby");
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("met à jour les erreurs pendant la saisie, après une première tentative", async () => {
    const { user, field, submit } = setup();
    await submit();
    await user.type(field.name, "Camille");
    expect(screen.queryByText("Indiquez votre nom.")).not.toBeInTheDocument();
    expect(field.name).not.toHaveAttribute("aria-invalid");
    // Les autres champs, toujours vides, gardent leur erreur.
    for (const input of [field.email, field.subject, field.message]) {
      expect(input).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("n'affiche aucune erreur pendant la saisie tant que le visiteur n'a pas tenté d'envoyer", async () => {
    const { user, field } = setup();
    await user.type(field.message, "Bonj");
    expect(screen.queryAllByText(/Indiquez|un peu court|Écrivez/)).toHaveLength(0);
    for (const input of [field.name, field.email, field.subject, field.message]) {
      expect(input).not.toHaveAttribute("aria-invalid");
    }
  });
});

describe("Champ piège anti-robots", () => {
  it("un robot qui remplit le champ piège ne déclenche AUCUN envoi (et croit avoir réussi)", async () => {
    const { user, field, submit, fillValid } = setup();
    await fillValid();
    await user.type(field.honeypot, "https://spam.example");
    await submit();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText(/votre message a bien été envoyé/)).toBeInTheDocument();
    expect(field.name).toHaveValue("");
  });

  it("le champ piège est caché aux visiteurs et hors de la navigation au clavier", () => {
    const { field } = setup();
    expect(field.honeypot).toHaveAttribute("tabindex", "-1");
    expect(field.honeypot.closest("[aria-hidden='true']")).not.toBeNull();
  });
});

describe("Envoi d'un message valide", () => {
  it("envoie exactement les champs saisis à Formspree, avec le sujet comme objet de l'e-mail", async () => {
    const { submit, fillValid } = setup();
    await fillValid();
    await submit();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(ENDPOINT);
    expect(options.method).toBe("POST");
    // Formspree n'accepte l'envoi en arrière-plan que s'il reçoit du JSON et qu'on lui en demande en retour.
    const headers = new Headers(options.headers);
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("accept")).toBe("application/json");
    expect(JSON.parse(options.body as string)).toEqual({
      name: "Camille Martin",
      email: "camille@exemple.fr",
      subject: "Proposition de stage",
      message: "Bonjour, votre profil m'intéresse.",
      _subject: "Portfolio — Proposition de stage",
    });
  });

  it("confirme l'envoi et vide le formulaire", async () => {
    const { field, submit, fillValid } = setup();
    await fillValid();
    await submit();

    expect(await screen.findByText(/votre message a bien été envoyé/)).toBeInTheDocument();
    for (const input of [field.name, field.email, field.subject, field.message]) expect(input).toHaveValue("");
  });

  it("pendant l'envoi : bouton désactivé, « Envoi en cours… » affiché et annoncé", async () => {
    let pending!: Deferred;
    fetchMock.mockImplementation(() => new Promise<Response>((resolve, reject) => (pending = { resolve, reject })));
    const { submit, fillValid } = setup();
    await fillValid();
    await submit();

    expect(screen.getByRole("button", { name: /envoi en cours/i })).toBeDisabled();
    expect(screen.getByText("Envoi du message en cours…")).toHaveClass("sr-only");
    await act(async () => pending.resolve(new Response("{}", { status: 200 })));
    expect(await screen.findByText(/votre message a bien été envoyé/)).toBeInTheDocument();
  });

  it("place le focus sur la confirmation (lue par les lecteurs d'écran)", async () => {
    const { submit, fillValid } = setup();
    await fillValid();
    await submit();
    const message = await screen.findByText(/votre message a bien été envoyé/);
    await waitFor(() => expect(message.closest("[aria-live]")).toHaveFocus());
  });

  it("efface le message de succès dès qu'une nouvelle saisie commence", async () => {
    const { user, field, submit, fillValid } = setup();
    await fillValid();
    await submit();
    const message = await screen.findByText(/votre message a bien été envoyé/);
    await waitFor(() => expect(message.closest("[aria-live]")).toHaveFocus());

    await user.type(field.name, "A");
    expect(screen.queryByText(/votre message a bien été envoyé/)).not.toBeInTheDocument();
  });
});

describe("Échec de l'envoi", () => {
  it.each([
    ["le service répond par une erreur", () => Promise.resolve(new Response("{}", { status: 500 }))],
    ["la connexion est coupée", () => Promise.reject(new TypeError("Failed to fetch"))],
  ])("si %s : message d'erreur avec l'e-mail en solution de repli, saisie conservée", async (_cas, failure) => {
    fetchMock.mockImplementation(failure);
    const { field, submit, fillValid } = setup();
    await fillValid();
    await submit();

    expect(await screen.findByText(/n'a pas abouti/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: site.contact.email })).toHaveAttribute("href", `mailto:${site.contact.email}`);
    expect(field.message).toHaveValue("Bonjour, votre profil m'intéresse.");
  });

  it("abandonne au bout de 15 secondes sans réponse", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      fetchMock.mockImplementation(
        (_url: string, options: RequestInit) =>
          new Promise<Response>((_resolve, reject) =>
            options.signal?.addEventListener("abort", () => reject(new DOMException("Délai dépassé", "AbortError"))),
          ),
      );
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<ContactForm />);
      await user.type(screen.getByLabelText("Nom"), "Camille");
      await user.type(screen.getByLabelText("E-mail"), "camille@exemple.fr");
      await user.type(screen.getByLabelText("Sujet"), "Stage");
      await user.type(screen.getByLabelText("Message"), "Message assez long.");
      await user.click(screen.getByRole("button", { name: /envoyer le message/i }));

      // À 14 secondes : on attend encore.
      await act(async () => {
        vi.advanceTimersByTime(14_000);
      });
      expect(screen.getByRole("button", { name: /envoi en cours/i })).toBeDisabled();
      expect(screen.queryByText(/n'a pas abouti/)).not.toBeInTheDocument();
      expect((fetchMock.mock.calls[0][1] as RequestInit).signal?.aborted).toBe(false);
      // À 15 secondes : abandon et message d'erreur.
      await act(async () => {
        vi.advanceTimersByTime(1_000);
      });
      await waitFor(() => expect(screen.getByText(/n'a pas abouti/)).toBeInTheDocument());
    } finally {
      vi.useRealTimers();
    }
  });
});
