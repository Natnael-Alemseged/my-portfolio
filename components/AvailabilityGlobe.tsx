"use client";

import { motion } from "framer-motion";
import Globe from "react-globe.gl";

export default function AvailabilityGlobe() {
    return (
        <section
            id="availability"
            className="bg-[#0d0d0d] text-white py-16 px-6 md:px-12 flex flex-col items-center"
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl font-bold mb-8 text-[#00ff99]"
            >
                Availability & Remote Work
            </motion.h2>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col items-center max-w-3xl"
            >
                <div className="w-64 h-64 mb-6 rounded-3xl overflow-hidden shadow-lg">
                    <Globe
                        height={256}
                        width={256}
                        backgroundColor="transparent"
                        showAtmosphere
                        showGraticules
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        labelsData={[
                            {
                                lat: 9.03,
                                lng: 38.74,
                                text: "Addis Ababa, Ethiopia",
                                color: "white",
                                size: 15,
                            },
                        ]}
                    />
                </div>

                <p className="text-center text-xl font-semibold mb-2">
                    Based in Addis Ababa, Ethiopia
                </p>
                <p className="text-center text-gray-400 max-w-md">
                    I’m flexible with time zones and open to remote work worldwide. Let’s
                    connect and build something great together.
                </p>
            </motion.div>
        </section>
    );
}
