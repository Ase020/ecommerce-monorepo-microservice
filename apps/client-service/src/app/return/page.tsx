import Link from "next/link";
import React from "react";

interface ReturnPageProps {
  searchParams:
    | Promise<{
        session_id: string;
      }>
    | undefined;
}

export default async function ReturnPage({ searchParams }: ReturnPageProps) {
  const sessionId: string | undefined = (await searchParams)?.session_id;

  if (!sessionId) {
    return <div>No session id found!</div>;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/${sessionId}`
  );
  const data = await res.json();
  console.log("Session Data:", data);

  return (
    <div>
      <h1>Payment: {data.session.status}</h1>
      <p>Payment: {data.session.paymentStatus}</p>
      <Link href={"/orders"}>See your orders</Link>
    </div>
  );
}
