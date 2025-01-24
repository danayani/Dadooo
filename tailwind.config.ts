import type {Config} from "tailwindcss";

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                DMSans: "'DM Sans', sans-serif",
                GoogleSans: "'Google Sans', sans-serif",
                Poppins: "'Poppins', sans-serif"
            },
            colors: {
                White: '#ffffff',
                LightWhite: '#E9EAEA',
                WhiteSmoke: '#F6F7F7',
                GreenBlue: "#2DB8A1",
                Blue: "#0A66C2",
                VeryLightGray: "#F4F5F5",
                LightGray: "#949796",
                Gray: "#737877",
                DarkGray: "#484E4C"
            }
        },
    },
    plugins: [],
} satisfies Config;
