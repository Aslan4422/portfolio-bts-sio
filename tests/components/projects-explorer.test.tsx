// @vitest-environment jsdom
/*
 * Section Projets et fiche détaillée : lien partagé /projets/<slug>, ouverture depuis
 * une carte ou depuis le parcours, fermeture (croix, Échap) sans jamais faire quitter
 * le site, et onglets utilisables au clavier.
 */
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { renderToString } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// Adresse de la page simulée (dans le vrai site, elle est fournie par Next.js).
const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
// Les photos ne sont pas optimisées dans les tests : une simple balise <img>.
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- fausse image, uniquement pour les tests
  default: ({ src, alt }: ComponentProps<"img">) => <img src={typeof src === "string" ? src : ""} alt={alt} />,
}));

import { ProjectSheetLink } from "@/components/projects/project-sheet-link";
import { ProjectsExplorer } from "@/components/projects/projects-explorer";
import { getProjectsByDomain, projectDomains, projects } from "@/content/projects";
import { site } from "@/content/site";

// jsdom ne sait pas encore ouvrir une fenêtre <dialog> modale ni faire défiler un élément :
// versions simplifiées (tous les vrais navigateurs le font).
beforeAll(() => {
  Element.prototype.scrollTo ??= () => {};
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});

beforeEach(() => {
  nav.pathname = "/";
  window.history.replaceState(null, "", "/");
});

const dialog = () => document.querySelector<HTMLDialogElement>("dialog.project-dialog")!;
const firstProject = getProjectsByDomain(projectDomains[0].id)[0];

describe.each(projects.map((project) => [project.slug, project] as const))("Lien partagé /projets/%s", (slug, project) => {
  it("la fiche est déjà ouverte dans la page générée à l'avance (visible avant le JavaScript)", () => {
    nav.pathname = `/projets/${slug}`;
    const html = new DOMParser().parseFromString(renderToString(<ProjectsExplorer />), "text/html");
    expect(html.querySelector("dialog[open] #fiche-titre")?.textContent).toBe(project.title);
  });

  it("la fiche reste ouverte une fois la page chargée, avec le titre du projet dans l'onglet", () => {
    nav.pathname = `/projets/${slug}`;
    render(<ProjectsExplorer />);
    expect(dialog()).toHaveAttribute("open");
    expect(screen.getByRole("heading", { level: 2, name: project.title })).toBeInTheDocument();
    expect(document.title).toBe(`${project.title} · ${site.name}`);
  });
});

describe("Fermeture de la fiche", () => {
  it("arrivé par un lien partagé : la croix ramène à l'accueil sans quitter le site", async () => {
    nav.pathname = `/projets/${firstProject.slug}`;
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const replace = vi.spyOn(window.history, "replaceState");
    render(<ProjectsExplorer />);

    await userEvent.setup().click(screen.getByRole("button", { name: "Fermer la fiche" }));
    expect(replace).toHaveBeenCalledWith(null, "", "/");
    // « Retour » ferait quitter le site (la page précédente n'est pas le portfolio).
    expect(back).not.toHaveBeenCalled();
  });

  it("la touche Échap ferme aussi la fiche", () => {
    nav.pathname = `/projets/${firstProject.slug}`;
    const replace = vi.spyOn(window.history, "replaceState");
    render(<ProjectsExplorer />);

    fireEvent(dialog(), new Event("cancel", { cancelable: true }));
    expect(replace).toHaveBeenCalledWith(null, "", "/");
  });

  it("ouverte depuis une carte : l'adresse devient partageable, puis la croix revient en arrière", async () => {
    const user = userEvent.setup();
    const push = vi.spyOn(window.history, "pushState");
    const back = vi.spyOn(window.history, "back").mockImplementation(() => {});
    const { rerender } = render(<ProjectsExplorer />);
    expect(dialog()).not.toHaveAttribute("open");

    await user.click(screen.getByRole("link", { name: firstProject.title }));
    expect(push).toHaveBeenCalledWith(null, "", `/projets/${firstProject.slug}`);

    // Next.js signale le changement d'adresse : la fiche s'ouvre.
    nav.pathname = `/projets/${firstProject.slug}`;
    rerender(<ProjectsExplorer />);
    expect(dialog()).toHaveAttribute("open");

    await user.click(screen.getByRole("button", { name: "Fermer la fiche" }));
    expect(back).toHaveBeenCalledTimes(1);
  });

  it("un Ctrl+clic sur une carte laisse le navigateur ouvrir un nouvel onglet", () => {
    const push = vi.spyOn(window.history, "pushState");
    render(<ProjectsExplorer />);
    const link = screen.getByRole("link", { name: firstProject.title });
    expect(link).toHaveAttribute("href", `/projets/${firstProject.slug}`);

    // On note si le site a bloqué le clic, puis on empêche jsdom de tenter d'ouvrir la page.
    let blockedBySite: boolean | undefined;
    const record = (event: Event) => {
      blockedBySite = event.defaultPrevented;
      event.preventDefault();
    };
    document.addEventListener("click", record);
    link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true }));
    document.removeEventListener("click", record);

    expect(blockedBySite).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });
});

describe("Liens « Voir le projet » (parcours, veille)", () => {
  it("ouvrent la fiche du projet dans la section Projets", async () => {
    const slug = projects[projects.length - 1].slug;
    const push = vi.spyOn(window.history, "pushState");
    render(
      <>
        <ProjectSheetLink slug={slug}>Voir le projet</ProjectSheetLink>
        <ProjectsExplorer />
      </>,
    );
    await userEvent.setup().click(screen.getByRole("link", { name: "Voir le projet" }));
    expect(push).toHaveBeenCalledWith(null, "", `/projets/${slug}`);
  });
});

describe("Onglets des domaines", () => {
  it("affichent les projets du domaine choisi, au clic comme au clavier (flèches, Début, Fin)", async () => {
    const user = userEvent.setup();
    render(<ProjectsExplorer />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs.map((tab) => tab.textContent)).toEqual(projectDomains.map((domain) => domain.label));
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    const shownTitles = () => [...screen.getByRole("tabpanel").querySelectorAll("h3")].map((h) => h.textContent);

    // Flèche droite : onglet suivant, sélectionné et focalisé.
    tabs[0].focus();
    await user.keyboard("{ArrowRight}");
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[1]).toHaveFocus();
    expect(shownTitles()).toEqual(getProjectsByDomain(projectDomains[1].id).map((p) => p.title));

    // Début / Fin.
    await user.keyboard("{Home}");
    expect(tabs[0]).toHaveFocus();
    await user.keyboard("{End}");
    expect(tabs[tabs.length - 1]).toHaveFocus();

    // Un seul onglet atteignable avec Tab (les autres avec les flèches).
    expect(tabs.filter((tab) => tab.tabIndex === 0)).toHaveLength(1);
  });
});
