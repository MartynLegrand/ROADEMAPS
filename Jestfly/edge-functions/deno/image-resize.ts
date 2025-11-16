// Deno Edge Function for Image Resizing
// Deploy to Deno Deploy or Cloudflare Workers

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

interface ResizeParams {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
}

async function resizeImage(params: ResizeParams): Promise<Response> {
  const { url, width = 800, height = 600, quality = 80 } = params;

  try {
    // Fetch original image
    const response = await fetch(url);
    if (!response.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const imageData = await response.arrayBuffer();

    // In production, use image processing library like sharp or ImageMagick
    // For demonstration, we return the original image with appropriate headers
    return new Response(imageData, {
      headers: {
        "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Resize-Width": width.toString(),
        "X-Resize-Height": height.toString(),
      },
    });
  } catch (error) {
    console.error("Image resize error:", error);
    return new Response("Failed to process image", { status: 500 });
  }
}

serve(async (req: Request) => {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get("url");
  const width = parseInt(url.searchParams.get("width") || "800");
  const height = parseInt(url.searchParams.get("height") || "600");
  const quality = parseInt(url.searchParams.get("quality") || "80");

  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  return await resizeImage({
    url: imageUrl,
    width,
    height,
    quality,
  });
});
