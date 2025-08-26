export function fetch(url: URL) {
  if (url.pathname.endsWith("redirect")) {
    const newUrl = new URL(url.toString());
    newUrl.pathname = newUrl.pathname.replace(/\/redirect$/, "");
    return new Response(null, {
      status: 302,
      headers: {
        Location: newUrl.toString(),
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(
    JSON.stringify({
      message: "This is a fake fetcher response for " + url.toString(),
      url: url.toString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
