import AircraftPageClient from "@/components/aircraft/AircraftPageClient";

export async function generateMetadata({ params }: { params: { identifier: string } }) {
  return { title: `Aircraft ${params.identifier} · Pastel Radar` };
}

export default function AircraftPage({ params }: { params: { identifier: string } }) {
  return <AircraftPageClient hex={params.identifier.toLowerCase()} />;
}
