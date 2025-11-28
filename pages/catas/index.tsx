import DefaultLayout from "@/layouts/default";
import CatasSection from "@/components/CatasSection";
import Contacto from "@/components/Contacto";

export default function CatasPage() {
  return (
    <DefaultLayout>
      {/* Main Content */}
      <CatasSection />

      {/* Contact Section */}
      <Contacto />
    </DefaultLayout>
  );
}
