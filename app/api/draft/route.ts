// route handler with secret and slug
import { getPreviewPostBySlug } from "@/lib/api-graphql";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response("Invalid token", { status: 401 });
  }

  const post = await getPreviewPostBySlug(slug);

  if (!post) {
    return new Response("Invalid slug", { status: 404 });
  }

  draftMode().enable();

  const cookieStore = cookies();
  const cookie = cookieStore.get("__prerender_bypass");
  //@ts-expect-error
  cookies().set({
    name: "__prerender_bypass",
    value: cookie?.value,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  redirect(`/posts/${post.slug}`);
}
