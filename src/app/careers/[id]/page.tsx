import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchJobById } from "@/lib/api";
import { JobDetailsClient } from "@/components/careers/JobDetailsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await fetchJobById(id);
  
  if (!job) {
    return {
      title: "Job Not Found | HR Fashion",
    };
  }

  return {
    title: `${job.title} - Careers | HR Fashion`,
    description: job.description,
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await fetchJobById(id);
  
  if (!job) {
    notFound();
  }

  return <JobDetailsClient job={job} />;
}
