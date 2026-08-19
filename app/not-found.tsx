import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Ovaj predložak ne postoji.</h1>
      <Link href="/">Natrag na svih 9 predložaka</Link>
    </main>
  );
}

