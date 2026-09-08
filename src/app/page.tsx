import { Hero } from "@/components/Hero";
import { Tape } from "@/components/Tape";
import { LeftHalf } from "@/components/LeftHalf";
import { Steps } from "@/components/Steps";
import { Collapse } from "@/components/Collapse";
import { OwnershipFacts } from "@/components/OwnershipFacts";
import { Integrity } from "@/components/Integrity";
import { Listings } from "@/components/Listings";
import { Estimator } from "@/components/Estimator";
import { Tiers } from "@/components/Tiers";
import { Questions } from "@/components/Questions";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Tape />
      <LeftHalf />
      <Steps />
      <Collapse />
      <OwnershipFacts />
      <Integrity />
      <Listings />
      <Estimator />
      <Tiers />
      <Questions />
      <Footer />
    </main>
  );
}
