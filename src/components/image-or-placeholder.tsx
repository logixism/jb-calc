"use client";

import { StyleHTMLAttributes, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { useTheme } from "next-themes";

interface ImageOrPlaceholderProps {
  src?: string | null;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
}

const MISSING_IMAGE_LIGHT_MODE = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlLW9mZi1pY29uIGx1Y2lkZS1pbWFnZS1vZmYiPjxsaW5lIHgxPSIyIiB4Mj0iMjIiIHkxPSIyIiB5Mj0iMjIiLz48cGF0aCBkPSJNMTAuNDEgMTAuNDFhMiAyIDAgMSAxLTIuODMtMi44MyIvPjxsaW5lIHgxPSIxMy41IiB4Mj0iNiIgeTE9IjEzLjUiIHkyPSIyMSIvPjxsaW5lIHgxPSIxOCIgeDI9IjIxIiB5MT0iMTIiIHkyPSIxNSIvPjxwYXRoIGQ9Ik0zLjU5IDMuNTlBMS45OSAxLjk5IDAgMCAwIDMgNXYxNGEyIDIgMCAwIDAgMiAyaDE0Yy41NSAwIDEuMDUyLS4yMiAxLjQxLS41OSIvPjxwYXRoIGQ9Ik0yMSAxNVY1YTIgMiAwIDAgMC0yLTJIOSIvPjwvc3ZnPg==`;

const MISSING_IMAGE_DARK_MODE = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1pbWFnZS1vZmYtaWNvbiBsdWNpZGUtaW1hZ2Utb2ZmIj48bGluZSB4MT0iMiIgeDI9IjIyIiB5MT0iMiIgeTI9IjIyIi8+PHBhdGggZD0iTTEwLjQxIDEwLjQxYTIgMiAwIDEgMS0yLjgzLTIuODMiLz48bGluZSB4MT0iMTMuNSIgeDI9IjYiIHkxPSIxMy41IiB5Mj0iMjEiLz48bGluZSB4MT0iMTgiIHgyPSIyMSIgeTE9IjEyIiB5Mj0iMTUiLz48cGF0aCBkPSJNMy41OSAzLjU5QTEuOTkgMS45OSAwIDAgMCAzIDV2MTRhMiAyIDAgMCAwIDIgMmgxNGMuNTUgMCAxLjA1Mi0uMjIgMS40MS0uNTkiLz48cGF0aCBkPSJNMjEgMTVWNWEyIDIgMCAwIDAtMi0ySDkiLz48L3N2Zz4=`;

export default function ImageOrPlaceholder({
  src,
  alt,
  width,
  height,
  className,
  style,
}: ImageOrPlaceholderProps) {
  const [error, setError] = useState(false);
  const { resolvedTheme } = useTheme();

  const MISSING_IMAGE =
    resolvedTheme === "dark"
      ? MISSING_IMAGE_DARK_MODE
      : MISSING_IMAGE_LIGHT_MODE;

  if (!src || error) {
    return (
      <Image
        src={MISSING_IMAGE}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={clsx("object-contain", className)}
        onError={() => setError(true)}
        unoptimized
      />
    );
  }

  return (
    <Image
      unoptimized
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={clsx("object-contain", className)}
      onError={() => setError(true)}
    />
  );
}
