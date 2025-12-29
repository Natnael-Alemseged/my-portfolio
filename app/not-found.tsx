"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0F1115] flex flex-col items-center justify-center px-4 overflow-hidden font-sans">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center flex-1 text-center z-10 w-full"
      >
        {/* 404 with dog inside the 0 */}
        <div className="flex items-center justify-center mb-8 select-none w-full gap-2 pr-2">
          <span className="text-white text-[160px] sm:text-[210px] md:text-[330px] font-black leading-none tracking-tighter">
            4
          </span>

          <div className="relative flex items-center justify-center mx-[-15px] sm:mx-[-25px] md:mx-[-45px]">
            {/* The "0" character as a backdrop or container */}
            <span className="text-white text-[160px] sm:text-[210px] md:text-[330px] font-black leading-none tracking-tighter opacity-100">
              0
            </span>

            {/* The Dog peeking out of the 0 */}
            <div
              className="absolute w-24 h-24 sm:w-32 sm:h-32 md:w-64 md:h-64 z-20 flex items-end justify-center bottom-[15%]"
            >
              <div className="relative w-full h-full">
                <Image
                  src="/sus-dog.png"
                  alt="Suspicious dog"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          </div>

          <span className="text-white text-[160px] sm:text-[210px] md:text-[330px] font-black leading-none tracking-tighter">
            4
          </span>
        </div>

        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-white text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Why are you here?
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl mb-12 max-w-sm mx-auto">
            You&apos;re not supposed to be here.
          </p>
        </motion.div>

        {/* Go home button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="bg-white text-black px-12 py-4 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] inline-block"
          >
            Go home
          </Link>
        </motion.div>
      </motion.div>


      {/* Android Home Bar Indicator - only decorative now */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/10 rounded-full" />
    </div>
  );
}
