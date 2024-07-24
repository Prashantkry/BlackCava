"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";
import coffee from "@/assets/Media";

export function ThreeDCard() {
  return (
    <CardContainer className="inter-var border-0">
      <CardBody className="dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
        <CardItem translateZ="100" className="w-full">
          <Image
            src={coffee}
            className="h-full w-full -rotate-12 group-hover/card:shadow-xl"
            alt="thumbnail"
          />
        </CardItem>

      </CardBody>
    </CardContainer>
  );
}
