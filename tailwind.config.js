module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: '640px',   
      md: '768px',    
      lg: '1024px',   
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      colors: {
        // Primary Colors
        primary: {
          background: "var(--primary-background)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)"
        },
        // Secondary Colors
        secondary: {
          background: "var(--secondary-background)",
          foreground: "var(--secondary-foreground)",
          light: "var(--secondary-light)",
          dark: "var(--secondary-dark)"
        },
        // Accent Colors
        accent: {
          success: "var(--accent-success)",
          'success-light': "var(--accent-success-light)",
          'success-lighter': "var(--accent-success-lighter)",
          warning: "var(--accent-warning)",
          'warning-light': "var(--accent-warning-light)",
          'warning-lighter': "var(--accent-warning-lighter)",
          error: "var(--accent-error)",
          'error-light': "var(--accent-error-light)"
        },
        // Background Colors
        background: {
          main: "var(--bg-main)",
          card: "var(--bg-card)",
          overlay: "var(--bg-overlay)",
          accent: "var(--bg-accent)",
          neutral: "var(--bg-neutral)",
          warm: "var(--bg-warm)",
          cream: "var(--bg-cream)",
          teal: "var(--bg-teal)",
          mint: "var(--bg-mint)",
          sage: "var(--bg-sage)"
        },
        // Text Colors
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          accent: "var(--text-accent)",
          inverse: "var(--text-inverse)"
        },
        // Border Colors
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          dark: "var(--border-dark)"
        },
        // Component-specific colors
        button: {
          background: "var(--button-bg)",
          text: "var(--button-text)"
        },
        link: {
          background: "var(--link-bg)",
          border: "var(--link-border)"
        },
        edittext: {
          'bg-primary': "var(--edittext-bg-primary)",
          'bg-secondary': "var(--edittext-bg-secondary)",
          'text-primary': "var(--edittext-text-primary)",
          'text-secondary': "var(--edittext-text-secondary)"
        },
        line: {
          'bg-primary': "var(--line-bg-primary)",
          'bg-secondary': "var(--line-bg-secondary)",
          'bg-accent': "var(--line-bg-accent)",
          'bg-dark': "var(--line-bg-dark)"
        }
      },
      fontSize: {
        'xs': 'var(--font-size-xs)',
        'sm': 'var(--font-size-sm)',
        'base': 'var(--font-size-base)',
        'md': 'var(--font-size-md)',
        'lg': 'var(--font-size-lg)',
        'xl': 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
        '5xl': 'var(--font-size-5xl)'
      },
      fontWeight: {
        'normal': 'var(--font-weight-normal)',
        'bold': 'var(--font-weight-bold)'
      },
      lineHeight: {
        'xs': 'var(--line-height-xs)',
        'sm': 'var(--line-height-sm)',
        'base': 'var(--line-height-base)',
        'md': 'var(--line-height-md)',
        'lg': 'var(--line-height-lg)',
        'xl': 'var(--line-height-xl)',
        '2xl': 'var(--line-height-2xl)',
        '3xl': 'var(--line-height-3xl)',
        '4xl': 'var(--line-height-4xl)',
        '5xl': 'var(--line-height-5xl)',
        '6xl': 'var(--line-height-6xl)'
      },
      spacing: {
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'base': 'var(--spacing-base)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
        '4xl': 'var(--spacing-4xl)',
        '5xl': 'var(--spacing-5xl)',
        '6xl': 'var(--spacing-6xl)',
        '7xl': 'var(--spacing-7xl)',
        '8xl': 'var(--spacing-8xl)',
        '9xl': 'var(--spacing-9xl)',
        '10xl': 'var(--spacing-10xl)',
        '11xl': 'var(--spacing-11xl)',
        '12xl': 'var(--spacing-12xl)',
        '13xl': 'var(--spacing-13xl)',
        '14xl': 'var(--spacing-14xl)',
        '15xl': 'var(--spacing-15xl)',
        '16xl': 'var(--spacing-16xl)',
        '17xl': 'var(--spacing-17xl)',
        '18xl': 'var(--spacing-18xl)',
        '19xl': 'var(--spacing-19xl)',
        '20xl': 'var(--spacing-20xl)',
        '21xl': 'var(--spacing-21xl)',
        '22xl': 'var(--spacing-22xl)'
      },
      borderRadius: {
        'xs': 'var(--radius-xs)',
        'sm': 'var(--radius-sm)',
        'base': 'var(--radius-base)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        '4xl': 'var(--radius-4xl)',
        '5xl': 'var(--radius-5xl)'
      },
      borderWidth: {
        'none': 'var(--border-width-none)',
        'thin': 'var(--border-width-thin)'
      }
    }
  },
  plugins: []
};