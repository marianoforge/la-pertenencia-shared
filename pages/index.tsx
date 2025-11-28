import DefaultLayout from "@/layouts/default";
import Hero from "@/components/Hero";
import ImaginaTuVino from "@/components/ImaginaTuVino";
import NewsLetterForm from "@/components/NewsLetterForm";
import CatasMaridajes from "@/components/CatasMaridajes";
import MembresiaMensual from "@/components/MembresiaMensual";
import EspacioLaPertenencia from "@/components/EspacioLaPertenencia";
import Contacto from "@/components/Contacto";
import Combos from "@/components/wines/Combos";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Hero />
      <Combos />
      <ImaginaTuVino />
      <NewsLetterForm />
      <EspacioLaPertenencia />
      <CatasMaridajes />
      <MembresiaMensual />
      <Contacto />
    </DefaultLayout>
  );
}
