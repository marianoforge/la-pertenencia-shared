import React from "react";

import FAQ from "../../components/FAQ";

import DefaultLayout from "@/layouts/default";
import Contacto from "@/components/Contacto";

const PreguntasFrecuentesPage = () => {
  return (
    <DefaultLayout>
      <FAQ />
      <Contacto />
    </DefaultLayout>
  );
};

export default PreguntasFrecuentesPage;
