import { readFileSync } from "fs";
import path from "path";
import Container from "@/app/_components/container";
import Header from "@/app/_components/header";
import { PostBody } from "@/app/_components/post-body";
import markdownToHtml from "@/lib/markdownToHtml";
import { FitnessAccordion } from "./_components/fitness-accordion";

export const metadata = {
  title: "Fitness Tracker",
  description: "Personal fitness tracking log",
};

export default async function FitnessPage() {
  const filePath = path.join(process.cwd(), "_private", "fitness_page.md");
  const rawMarkdown = readFileSync(filePath, "utf8");

  // Split on lines that start a new ## section
  const chunks = rawMarkdown.split(/\n(?=## )/);

  // Everything before the first ## is the intro (title, blockquote, hr)
  const introHtml = await markdownToHtml(chunks[0]);

  // Each remaining chunk is one Day section
  const days = await Promise.all(
    chunks.slice(1).map(async (chunk) => {
      const newline = chunk.indexOf("\n");
      const title = chunk.slice(0, newline).replace(/^##\s*/, "").trim();
      const body = chunk.slice(newline + 1);
      return { title, content: await markdownToHtml(body) };
    })
  );

  return (
    <main>
      <Container>
        <Header />
        <article className="mb-32 w-full max-w-2xl mx-auto">
          {/* Intro: title + blockquote */}
          <PostBody content={introHtml} />

          {/* Accordion: one card per Day section */}
          <FitnessAccordion days={days} />
        </article>
      </Container>
    </main>
  );
}
