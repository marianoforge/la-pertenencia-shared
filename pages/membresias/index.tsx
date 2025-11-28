import DefaultLayout from "@/layouts/default";
import MembresiasSection from "@/components/MembresiasSection";
import Contacto from "@/components/Contacto";

export default function MembresiasPage() {
  return (
    <DefaultLayout>
      {/* Main Content */}
      <MembresiasSection />

      {/* Contact Section */}
      <Contacto />
    </DefaultLayout>
  );
}
