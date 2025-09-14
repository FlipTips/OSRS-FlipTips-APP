import React from 'react';

/**
 * BrandParchmentLogo is a simple wrapper around an <img> tag that points to
 * the transparent parchment logo in the public assets folder.  You can
 * override any image attributes via props (e.g. width, height, className).
 */
export default function BrandParchmentLogo(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  return (
    <img src="/assets/ui/card-parchment.png" alt="Parchment Logo" {...props} />
  );
}