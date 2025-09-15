module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'agent-orange': '#FF6600',
        'agent-orange-dark': '#E55A00',
        'agent-orange-light': '#FF7A1A',
        'agent-dark': '#0A0A0A',
        'agent-gray': '#1A1A1A',
        'agent-gray-light': '#2A2A2A',
        'agent-gray-lighter': '#3A3A3A',
        'agent-text': '#FFFFFF',
        'agent-text-secondary': '#B0B0B0',
        'agent-text-muted': '#808080',
        'agent-accent': '#00D4FF',
        'agent-success': '#00C851',
        'agent-warning': '#FFBB33',
        'agent-error': '#FF4444',
      },
      backgroundImage: {
        'agent-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2A2A2A 100%)',
        'agent-orange-gradient': 'linear-gradient(135deg, #FF6600 0%, #FF7A1A 100%)',
        'agent-card-gradient': 'linear-gradient(145deg, #1A1A1A 0%, #2A2A2A 100%)',
      },
      boxShadow: {
        'agent': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'agent-lg': '0 16px 64px rgba(0, 0, 0, 0.4)',
        'agent-orange': '0 4px 16px rgba(255, 102, 0, 0.3)',
      },
      fontFamily: {
        'agent': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
