import { auth } from "@clerk/nextjs/server";
import React from "react";

async function TestPage() {
  const { getToken } = await auth();
  const token = await getToken();

  console.log("Token:", token);

  const resProduct = await fetch("http://localhost:8080/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    credentials: "include",
  });
  const dataProduct = await resProduct.json();
  console.log("Response from Product Service:", dataProduct);

  const resOrder = await fetch("http://localhost:8081/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    credentials: "include",
  });
  const dataOrder = await resOrder.json();
  console.log("Response from Order Service:", dataOrder);

  const resPayment = await fetch("http://localhost:8082/test", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    credentials: "include",
  });
  const dataPayment = await resPayment.json();
  console.log("Response from Payment Service:", dataPayment);

  return <div>TestPage</div>;
}

export default TestPage;
