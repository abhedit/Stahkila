import type { Metadata } from "next";
import MorphogenesisHome from "@/components/sites/morphogenesis/home";

export const metadata: Metadata = {
  title: "Interior & Architecture Design Consultancy Firm | Morphogenesis",
  description: "Morphogenesis is an integrated architecture, interiors, landscape, and master planning practice.",
};

export default function Home() {
  return <MorphogenesisHome />;
}
