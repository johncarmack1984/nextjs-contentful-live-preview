import { Asset, Entry } from "contentful";

interface Sys {
  id: string;
}

export interface Hero {
  __typename: string;
  sys: Sys;
  title: string;
  cta?: string;
  backgroundImage: Asset;
  link?: Entry;
}

interface HeroCollection {
  items: Hero[];
}

interface FetchResponse {
  data?: {
    heroCollection?: HeroCollection;
  };
}

const HERO_GRAPHQL_FIELDS = `
__typename
sys {
  id
}
title
cta
backgroundImage
link
`;

async function fetchGraphQL(
  query: string,
  draftMode = false
): Promise<FetchResponse> {
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          draftMode
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((response) => response.json());
}

function extractEntry(fetchResponse: FetchResponse): Hero | undefined {
  return fetchResponse?.data?.heroCollection?.items?.[0];
}

function extractHeroEntries(fetchResponse: FetchResponse): Hero[] | undefined {
  return fetchResponse?.data?.heroCollection?.items;
}

export async function getPreviewHeroBySlug(
  slug: string
): Promise<Hero | undefined> {
  const entry = await fetchGraphQL(
    `query {
      heroCollection(where: { slug: "${slug}" }, preview: true, limit: 1) {
        items {
          ${HERO_GRAPHQL_FIELDS}
        }
      }
    }`,
    true
  );
  return extractEntry(entry);
}

export async function getAllHeroesWithSlug(): Promise<Hero[] | undefined> {
  const entries = await fetchGraphQL(
    `query {
      heroCollection(where: { slug_exists: true }) {
        items {
          ${HERO_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractHeroEntries(entries);
}

export async function getAllHeroesForHome(
  draftMode: boolean
): Promise<Hero[] | undefined> {
  const entries = await fetchGraphQL(
    `query {
      heroCollection(preview: ${draftMode ? "true" : "false"}) {
        items {
          ${HERO_GRAPHQL_FIELDS}
        }
      }
    }`,
    draftMode
  );

  console.log(entries);
  return extractHeroEntries(entries);
}

export async function getPost(
  slug: string,
  draftMode: boolean
): Promise<{ post: Hero | undefined }> {
  const entry = await fetchGraphQL(
    `query {
      heroCollection(where: { slug: "${slug}" }, preview: ${
      draftMode ? "true" : "false"
    }, limit: 1) {
        items {
          ${POST_GRAPHQL_FIELDS}
        }
      }
    }`,
    draftMode
  );
  return {
    post: extractEntry(entry),
  };
}
