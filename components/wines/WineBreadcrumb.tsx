import Link from "next/link";

interface WineBreadcrumbProps {
  wineName: string;
  winery: string;
}

export const WineBreadcrumb: React.FC<WineBreadcrumbProps> = ({
  wineName,
  winery,
}) => (
  <nav
    aria-label="Breadcrumb"
    className="text-black text-sm md:text-base font-normal font-['Lora'] tracking-wide max-[480px]:hidden"
  >
    <ol className="flex items-center space-x-2">
      <li>
        <Link className="hover:text-amber-600 transition-colors" href="/">
          Inicio
        </Link>
      </li>
      <li aria-hidden="true" className="text-gray-500">
        /
      </li>
      <li>
        <Link className="hover:text-amber-600 transition-colors" href="/vinos">
          Vinos
        </Link>
      </li>
      <li aria-hidden="true" className="text-gray-500">
        /
      </li>
      <li aria-current="page" className="text-gray-600">
        {winery} {wineName}
      </li>
    </ol>
  </nav>
);

