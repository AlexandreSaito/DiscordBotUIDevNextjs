//import React from "react";

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
	console.log("POST LAYOUT")
  return (
		<section>
			<h1>POST</h1>
			{children}
		</section>
  );
}
