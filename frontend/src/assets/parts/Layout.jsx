import React from "react";
import Header from "../parts/Header";
import Footer from "../parts/Footer";
import "../css/Layout.css"; 

export default function Layout({ children }) {
    return (
        <div className="page-container">
            <Header />
            <main className="content">{children}</main>
            <Footer />
        </div>
    );
}
