import React from "react";

import TermsAndConditions from "../../components/TermsAndConditions";

import DefaultLayout from "@/layouts/default";
import Contacto from "@/components/Contacto";

const TerminosYCondicionesPage = () => {
  return (
    <DefaultLayout>
      <TermsAndConditions />
      <Contacto />
    </DefaultLayout>
  );
};

export default TerminosYCondicionesPage;
