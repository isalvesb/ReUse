"use client";

import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
    {
        id: 1,
        title: (
            <>
                Dê um novo
                <br />
                propósito
            </>
        ),
        description: "ao que você não usa mais",
        button: "Publicar item",
        href: "/perfil#publicar-item",
        image: "/images/banners/banner-1.png",
    },
    {
        id: 2,
        title: (
            <>
                Encontre algo
                <br />
                que combina com você
            </>
        ),
        description: "e dê uma nova vida para objetos que ainda têm muito a oferecer",
        button: "Explorar vitrine",
        href: "/vitrine",
        image: "/images/banners/banner-2.png",
    },
    {
        id: 3,
        title: (
            <>
                Compartilhe,
                <br />
                troque e reutilize
            </>
        ),
        description: "Faça parte de uma comunidade que acredita em novos propósitos.",
        button: "Conhecer a ReUse",
        href: "/#reuse",
        image: "/images/banners/banner-3.png",
    },
];

export default function Hero() {
    return (
        <section className="mx-auto mt-10 w-full max-w-7xl px-6">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                loop={true}
                className="overflow-hidden rounded-lg"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-96.75 w-full overflow-hidden rounded-lg">

                            {/* IMAGEM */}
                            <Image
                                src={slide.image}
                                alt=""
                                fill
                                sizes="(max-width: 768px) 100vw, 1280px"
                                priority={slide.id === 1}
                                className="object-cover"
                            />

                            {/* ESCURECE LEVEMENTE A IMAGEM */}
                            <div className="absolute inset-0 bg-black/20" />

                            {/* TEXTO */}
                            <div className="relative z-10 flex h-full items-center px-12">
                                <div className="max-w-md">

                                    <h1 className="text-4xl font-bold leading-tight text-reuse-white md:text-5xl">
                                        {slide.title}
                                    </h1>

                                    <p className="mt-2 text-lg text-reuse-white">
                                        {slide.description}
                                    </p>

                                    <Link
                                        href={slide.href}
                                        className="mt-6 inline-block rounded-xl bg-reuse-pink px-5 py-3 text-sm font-semibold text-reuse-brown transition hover:scale-105"
                                    >
                                        {slide.button}
                                    </Link>

                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}