import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <header
      className="w-full relative bg-white inline-flex flex-col justify-start items-center gap-2.5 fluid-hero-container max-[480px]:!px-0"
      id="hero"
      style={{
        paddingLeft: "clamp(1rem, 2.5vw, 2.5rem)",
        paddingRight: "clamp(1rem, 2.5vw, 2.5rem)",
        paddingTop: "clamp(2.5rem, 8vw, 5rem)",
        paddingBottom: "clamp(2.5rem, 8vw, 0rem)",
      }}
    >
      {/* Background Image */}
      <div className="w-full h-full absolute inset-0 overflow-hidden">
        <Image
          fill
          alt="Hero"
          className="object-[center_70%]"
          src="/images/bg-hero.png"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent lg:bg-gradient-to-l lg:from-black/10 lg:via-black/0 lg:to-transparent" />
      </div>

      {/* Content - Mobile/Tablet Layout */}
      <div
        className="relative z-10 w-full flex-col justify-start items-center fluid-hero-mobile"
        style={{
          paddingLeft: "clamp(0rem, 3vw, 1.5rem)",
          paddingRight: "clamp(0rem, 3vw, 1.5rem)",
          gap: "clamp(1.25rem, 4vw, 2rem)",
        }}
      >
        {/* Logo */}
        <div
          className="relative overflow-hidden flex items-center justify-center"
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            width: "clamp(8rem, 25vw, 10rem)",
            height: "clamp(12rem, 35vw, 15rem)",
          }}
        >
          <Image
            alt="La Pertenencia - Logo"
            className="object-contain w-full h-full"
            height={240}
            priority
            src="/images/logo-pertenencia.png"
            width={160}
          />
        </div>

        {/* Text Content */}
        <div
          className="w-full flex flex-col justify-start items-center"
          style={{
            paddingTop: "clamp(0.625rem, 2vw, 1.25rem)",
            gap: "clamp(1.25rem, 4vw, 1.75rem)",
          }}
        >
          <h1
            className="w-full text-center text-dorado-light font-normal font-lora uppercase"
            data-aos="fade-up"
            data-aos-delay="400"
            style={{
              fontSize: "clamp(1.125rem, 4vw, 1.75rem)",
              letterSpacing: "clamp(0.25rem, 1vw, 0.75rem)",
              lineHeight: "1.2",
            }}
          >
            Donde el vino une,
            <br />
            nace la pertenencia.
          </h1>
          <div
            className="w-full flex flex-col justify-start items-start"
            style={{ gap: "clamp(0.625rem, 2vw, 1rem)" }}
          >
            <blockquote
              className="w-full text-center text-white font-normal font-lora tracking-wide"
              style={{
                fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                lineHeight: "clamp(1.25, 1.5, 1.5)",
              }}
            >
              &quot;La Pertenencia es mucho más que un negocio: es el reflejo de
              nuestro proyecto de vida. Un lugar donde nos rodeamos de buena
              gente, compartimos buena energía y, por supuesto, disfrutamos del
              buen vino.&quot;
            </blockquote>
            <p
              className="w-full text-center text-white font-normal font-lora tracking-wide"
              style={{
                fontSize: "clamp(0.875rem, 2.5vw, 1rem)",
                lineHeight: "clamp(1.25, 1.5, 1.5)",
              }}
            >
              Un proyecto que crece con cada persona que se suma, no es
              solamente vender vinos, es compartir historias, es atesorar
              experiencias que nos conectan con lo que nos gusta y nos hace
              bien.
            </p>
          </div>
        </div>
      </div>

      {/* Content - Desktop Layout */}
      <div
        className="relative z-10 w-full max-w-[1300px] fluid-hero-desktop"
        style={{
          height: "clamp(25rem, 40vw, 35rem)",
        }}
      >
        {/* Text Column */}
        <div
          className="flex flex-col justify-start items-start"
          style={{
            width: "clamp(40rem, 60vw, 55rem)",
            height: "clamp(20rem, 30vw, 22.25rem)",
            paddingTop: "clamp(2rem, 4vw, 3.5rem)",
            paddingLeft: "clamp(1.5rem, 4vw, 3rem)",
            gap: "clamp(1.25rem, 2.5vw, 1.75rem)",
          }}
        >
          <h1
            className="justify-start text-dorado-light font-normal font-lora uppercase"
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              letterSpacing: "clamp(0.5rem, 1.2vw, 1rem)",
              lineHeight: "1.2",
            }}
          >
            Donde el vino une,
            <br />
            nace la pertenencia.
          </h1>
          <div
            className="self-stretch flex flex-col justify-start items-start"
            style={{ gap: "clamp(0.625rem, 1.5vw, 1rem)" }}
          >
            <blockquote className="self-stretch justify-start">
              <span
                className="text-white font-normal italic font-lora tracking-tight"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  lineHeight: "clamp(1.4, 1.6, 1.6)",
                }}
              >
                &quot;
              </span>
              <strong
                className="text-white font-semibold font-lora italic tracking-tight"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  lineHeight: "clamp(1.4, 1.6, 1.6)",
                }}
              >
                La Pertenencia es mucho más que un negocio:
              </strong>
              <span
                className="text-white font-normal font-lora italic tracking-wide"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  lineHeight: "clamp(1.4, 1.6, 1.6)",
                }}
              >
                {" "}
                es el reflejo de nuestro proyecto de vida. Un lugar donde nos
                rodeamos de buena gente, compartimos buena energía y, por
                supuesto, disfrutamos del buen vino.&quot;
              </span>
            </blockquote>
            <p
              className="self-stretch justify-start text-white font-normal italic font-lora tracking-wide"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                lineHeight: "clamp(1.4, 1.7, 1.7)",
              }}
            >
              Un proyecto que crece con cada persona que se suma, no es
              solamente vender vinos, es compartir historias, es atesorar
              experiencias que nos conectan con lo que nos gusta y nos hace
              bien.
            </p>
          </div>
        </div>

        {/* Logo Column */}
        <div
          className="relative ml-auto flex items-center justify-center overflow-hidden"
          style={{
            width: "clamp(17rem, 30vw, 21rem)",
            height: "clamp(23rem, 40vw, 33rem)",
          }}
        >
          <div
            className="relative flex items-center justify-center mb-24"
            style={{
              width: "clamp(16rem, 24vw, 17rem)",
              height: "clamp(18rem, 32vw, 26rem)",
              zIndex: 50,
            }}
          >
            <Image
              alt="La Pertenencia - Logo"
              className="object-contain w-full h-full"
              height={640}
              priority
              src="/images/logo-pertenencia.png"
              width={440}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
