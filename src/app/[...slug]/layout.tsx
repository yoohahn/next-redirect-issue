import { type Metadata } from "next";
import { fetch } from "./__fake-fetcher";

export const revalidate = 360000;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const pathName = "/" + ((await props.params).slug || []).join("/");
  const url = new URL(pathName, "http://localhost:3000");
  const data = fetch(url);

  return {
    title: "Foo",
  } as Metadata;
}

export default function Layout(props: React.PropsWithChildren) {
  return props.children;
}
