// src/components/Layout/Layout.js
import React from "react";
import Header from "../Header/header";   // make sure your path matches
import Footer from "../Fotter/fotter";   // check folder name: Fotter or Footer

export default function Layout({ children }) {
  return (
    <>
      {/* Header stays consistent */}
      <Header />

      {/* Main content */}
      <main
        style={{
          minHeight: "calc(100vh - 120px)", // ensures full-page layout minus header/footer height
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>

      {/* Footer stays consistent */}
      <Footer />
    </>
  );
}
