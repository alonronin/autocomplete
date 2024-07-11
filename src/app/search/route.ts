import { NextResponse } from "next/server";

const data = fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
  res.json(),
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  await new Promise((resolve) =>
    setTimeout(resolve, Math.round(Math.random() * 1000)),
  );
  const result = await data;

  return NextResponse.json(
    result.filter((post: { title: string }) => post.title.includes(query)),
  );
}
