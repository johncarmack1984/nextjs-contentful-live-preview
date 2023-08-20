"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import ErrorPage from "next/error";
import { Post } from "@/lib/api-graphql";

export default function PostLayout({ post }: { post: Post | undefined }) {
  const updatedPost = useContentfulLiveUpdates(post);

  const inspectorProps = useContentfulInspectorMode({ entryId: post?.sys.id });

  if (!updatedPost) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <article className="p-10 mx-auto w-fit">
      <h1 {...inspectorProps({ fieldId: "title" })} className="text-3xl mb-6">
        {updatedPost.title || ""}
      </h1>
      <p {...inspectorProps({ fieldId: "description" })}>
        {updatedPost.description || ""}
      </p>
    </article>
  );
}
