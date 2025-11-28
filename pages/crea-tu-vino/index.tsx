import DefaultLayout from "@/layouts/default";
import CreaTuVinoSection from "@/components/CreaTuVinoSection";
import Contacto from "@/components/Contacto";

export default function CreaTuVinoPage() {
  return (
    <DefaultLayout>
      {/* Main Content */}
      <CreaTuVinoSection />

      {/* Contact Section */}
      <Contacto />
    </DefaultLayout>
  );
}
