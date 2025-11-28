import { Wine } from "@/types/wine";

interface WineInfoSectionProps {
  wine: Wine;
}

export const WineInfoSection: React.FC<WineInfoSectionProps> = ({ wine }) => (
  <section className="self-stretch py-5 inline-flex flex-col justify-start items-start gap-5">
    <div className="self-stretch pb-2.5 flex flex-col justify-start items-start gap-2.5">
      <h2 className="self-stretch pb-[5px] justify-start text-yellow-700 text-xl font-medium font-['Lora'] uppercase tracking-[5px]">
        Descripción
      </h2>
      <p className="self-stretch justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
        {wine.description}
      </p>
    </div>
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5">
      <h2 className="self-stretch pb-[5px] justify-start text-yellow-700 text-xl font-medium font-['Lora'] uppercase tracking-[5px]">
        Características
      </h2>
      <dl className="self-stretch flex flex-col gap-2.5">
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Bodega:
          </dt>
          <dd className="text-center justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.bodega}
          </dd>
        </div>
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Marca:
          </dt>
          <dd className="text-center justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.marca}
          </dd>
        </div>
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Tipo:
          </dt>
          <dd className="text-center justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.tipo}
          </dd>
        </div>
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Varietal:
          </dt>
          <dd className="text-center justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.varietal}
          </dd>
        </div>
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Región:
          </dt>
          <dd className="text-center justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.region}
          </dd>
        </div>
        <div className="self-stretch pb-[5px] inline-flex justify-start items-start gap-2.5">
          <dt className="justify-start text-neutral-900 text-base font-semibold font-['Lora'] tracking-wide">
            Maridaje:
          </dt>
          <dd className="flex-1 justify-start text-neutral-900 text-base font-normal font-['Lora'] tracking-wide">
            {wine.maridaje}
          </dd>
        </div>
      </dl>
    </div>
  </section>
);

