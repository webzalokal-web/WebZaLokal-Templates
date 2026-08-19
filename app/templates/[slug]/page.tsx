import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateSite } from "@/components/template-site";
import { getSampleSite } from "@/lib/sample-sites";
import { getTheme, themes } from "@/lib/themes";
import { assertSiteConfig } from "@/lib/validate-site";

type TemplatePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return themes.map((theme) => ({ slug: theme.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const theme = getTheme(slug);
  const site = getSampleSite(slug);

  if (!theme || !site) return {};

  return {
    title: `${site.brandName} — ${theme.name}`,
    description: site.introduction.hr,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const theme = getTheme(slug);
  const site = getSampleSite(slug);

  if (!theme || !site) notFound();

  assertSiteConfig(site, theme);

  return <TemplateSite site={site} theme={theme} />;
}
