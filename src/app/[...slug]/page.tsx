import Image from "next/image";
import styles from "./page.module.css";
import { fetch } from "./__fake-fetcher";
import { redirect } from "next/navigation";

export default async function Home(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const pathName = "/" + ((await props.params).slug || []).join("/");
  const url = new URL(pathName, "http://localhost:3000");
  const data = fetch(url);
  if (data.status === 302) {
    const location = data.headers.get("Location");
    if (location) {
      const to = new URL(location);
      return redirect(to.pathname);
    }
  }
  const json: {
    message: string;
    url: string;
  } = await data.json();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>
          <a style={{ paddingRight: 10 }} href="/en/foo">
            Foo
          </a>
          <a style={{ paddingRight: 10 }} href="/en/bar">
            Bar
          </a>
          <a style={{ paddingRight: 10 }} href="/en/foo/redirect">
            Redirect
          </a>
        </div>
        <div>
          <div>{`Message: "${json.message}"`}</div>
          <div>{`JSON URL: "${json.url}"`}</div>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
