/**
 * Skip to main content link para accesibilidad
 * Permite a usuarios de lectores de pantalla saltar al contenido principal
 */

export const SkipToMainContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only"
    >
      Saltar al contenido principal
    </a>
  );
};

