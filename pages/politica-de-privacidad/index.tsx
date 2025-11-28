import React from "react";

import PrivacyPolicy from "../../components/PrivacyPolicy";

import DefaultLayout from "@/layouts/default";
import Contacto from "@/components/Contacto";

const PoliticaDePrivacidadPage = () => {
  return (
    <DefaultLayout>
      <PrivacyPolicy />
      <Contacto />
    </DefaultLayout>
  );
};

export default PoliticaDePrivacidadPage;
