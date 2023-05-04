/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/*.{js,ejs,html}", "./src/**/*.{js,ejs,html}"],
    theme: {
        extend: {
            screens: {
                '3xl': '1700px',
            }
        },
    },
    safelist: [
        "grid-cols-1",
        "grid-cols-2",
        "grid-cols-3",
        "grid-cols-4",
        "grid-cols-5",
    ],
    plugins: [],
}

