import { React } from "react";

import LandingHeader from "../global/landingHeader";
import Search from "./search";
import Testimonials from "./testimonials";
import Benefits from "./benefits";
import Footer from "./footer";
import Faq from "./faq";

export function Home() {

    return (
        <>
            <LandingHeader />

            <Search />

            <Testimonials />

            <Benefits />

            <Faq />

            <Footer />
        </>
    );
}