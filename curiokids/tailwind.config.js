module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
      backgroundImage: {
        'math': "url('/bgm1.jpg')",
        'science': "url('/images/science-bg.jpg')",
        'history': "url('/images/history-bg.jpg')",
        'programming': "url('/images/programming-bg.jpg')",
        'literature': "url('/images/literature-bg.jpg')",
      }
    },
  },
  plugins: [],
};
