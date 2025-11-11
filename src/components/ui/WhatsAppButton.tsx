import React from "react";

const phone = "9363101958";
const message = encodeURIComponent("Hello! I would like to know more about your services.");

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${phone}?text=${message}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="
      fixed z-50 bottom-6 right-6
      flex items-center justify-center
      w-11 h-11 md:w-12 md:h-12
      bg-green-500 hover:bg-green-600
      rounded-full shadow-lg
      transition-all duration-300
      focus:outline-none
      active:scale-95
      animate-bounce
      group
    "
    style={{ boxShadow: "0 4px 24px 0 rgba(37, 211, 102, 0.3)" }}
  >
    <svg
      className="w-8 h-8 md:w-8 md:h-8 text-white"
      fill="currentColor"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.236 6.364L4 29l7.01-2.212A12.94 12.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22.917c-2.13 0-4.21-.625-5.97-1.805l-.426-.271-4.164 1.316 1.36-4.02-.277-.414A9.917 9.917 0 0 1 6.083 15c0-5.478 4.48-9.917 9.917-9.917S25.917 9.522 25.917 15 21.478 25.917 16 25.917zm5.417-7.25c-.297-.148-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.148-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.762-1.654-2.06-.173-.297-.018-.457.13-.605.134-.134.298-.347.446-.52.148-.173.198-.297.297-.495.099-.198.05-.372-.025-.52-.074-.148-.669-1.613-.916-2.21-.242-.582-.488-.503-.669-.513-.173-.009-.372-.011-.57-.011-.198 0-.52.074-.793.372-.272.297-1.04 1.017-1.04 2.48 0 1.463 1.065 2.88 1.215 3.078.149.198 2.14 3.278 5.188 4.468.726.299 1.292.477 1.734.61.728.232 1.393.199 1.91.121.583-.086 1.758-.719 2.008-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    </svg>
    <span className="sr-only">Chat on WhatsApp</span>
  </a>
);

export default WhatsAppButton;