import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/sections/home-page";
import { getProjectBySlug, projects } from "@/content/projects";
import { site } from "@/content/site";
import { projectOgContent } from "@/lib/og";
import { ogImage, openGraphBase } from "@/lib/seo";

/*
 * Lien partageable d'un projet : /projets/<slug>.
 * Affiche la page d'accueil avec la fiche du projet déjà ouverte
 * (voir components/projects/projects-explorer.tsx), et donne à la page
 * le titre et la description du projet (référencement, aperçu LinkedIn).
 */

type ProjectPageProps = { params: Promise<{ slug: string }> };

/** Une adresse est générée pour chaque projet ; toute autre adresse renvoie une 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  const path = `/projets/${project.slug}`;
  const title = `${project.title} · ${site.name}`;
  // Image d'aperçu dessinée par ./opengraph-image.tsx ; sa version suit les textes affichés dessus.
  const image = ogImage(
    `${path}/opengraph-image`,
    `Aperçu du projet « ${project.title} » — portfolio d'${site.name}, BTS SIO SISR`,
    projectOgContent(project),
  );
  return {
    title: project.title,
    description: project.pitch,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, url: path, title, description: project.pitch, images: [image] },
    // X (Twitter) reprend l'image de l'aperçu Open Graph.
    twitter: { card: "summary_large_image", title, description: project.pitch },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  if (!getProjectBySlug(slug)) notFound();
  return <HomePage />;
}
