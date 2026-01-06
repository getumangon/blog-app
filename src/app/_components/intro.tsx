"use client";

import Head from "next/head";
import Logo from './logo';
import { useTheme } from '@/app/context/ThemeContext';
import type { CSSProperties } from 'react';

export function Intro() {

    const { darkMode } = useTheme();

    const styles = {
      main: {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      },
      content: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column" as CSSProperties['flexDirection'],
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: "var(--text-color)",
        fontFamily: "monospace",
        textAlign: "center",
        padding: "1rem",
        maxWidth: "800px",
        margin: "0 auto",
      },
      logo: {
        marginBottom: "2rem",
        transition: "transform 0.3s ease, filter 0.3s ease",
        '&:hover': {
          transform: "scale(1.02)",
        },
      },
      title: {
        fontSize: "2.8rem",
        marginBottom: "0.5rem",
        fontWeight: "500",
        letterSpacing: "0.5px",
        filter: "drop-shadow(0 0 10px var(--shadow-color-primary))",
        transition: "filter 0.3s ease",
      },
      subtitle: {
        fontSize: "1rem",
        marginBottom: "1.5rem",
        color: "var(--secondary-text)",
        fontWeight: "normal",
        filter: "drop-shadow(0 0 8px var(--shadow-color-secondary))",
        transition: "filter 0.3s ease",
      },
      socialLinks: {
        display: "flex",
        gap: "1.5rem",
        marginBottom: "2rem",
      },
      socialIcon: {
        width: "24px",
        height: "24px",
        color: "var(--text-color)",
        opacity: 0.8,
        filter: "drop-shadow(0 0 8px var(--shadow-color-primary))",
        transition: "all 0.3s ease, filter 0.3s ease",
        '&:hover': {
          opacity: 1,
          transform: "translateY(-2px)",
        },
      },
      linkIcon: {
        width: "24px",
        height: "24px",
        color: "var(--text-color)",
        opacity: 0.8,
        filter: "drop-shadow(0 0 8px var(--shadow-color-primary))",
        transition: "all 0.3s ease, filter 0.3s ease",
        '&:hover': {
          opacity: 1,
          transform: "translateY(-2px)",
        },
        marginLeft: "0.3rem",
      },
      description: {
        fontSize: "0.95rem",
        lineHeight: "1.5",
        maxWidth: "550px",
        margin: "0 auto 2.5rem",
        color: "var(--secondary-text)",
        filter: "drop-shadow(0 0 8px var(--shadow-color-secondary))",
        transition: "filter 0.3s ease",
      },
      navLinks: {
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
      },
      navButton: {
        color: "var(--text-color)",
        textDecoration: "none",
        fontSize: "1.1rem",
        opacity: 0.8,
        filter: "drop-shadow(0 0 8px var(--shadow-color-primary))",
        transition: "all 0.3s ease, filter 0.3s ease",
        '&:hover': {
          opacity: 1,
          transform: "translateY(-1px)",
        },
        display: "flex",
      },
      navSeparator: {
        color: "var(--secondary-text)",
        fontSize: "1.1rem",
        filter: "drop-shadow(0 0 8px var(--shadow-color-secondary))",
        transition: "filter 0.3s ease",
      },
    };

  return (
    <section className="">

      <Head>
        <title>Umang.life</title>
        <meta name="description" content="Umang.life - Portfolio and Projects" />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Umang.life - Portfolio & Projects" />
        <meta
          property="og:description"
          content="I try to build cool things."
        />
        <meta property="og:image" content="/foxtako.png" />
        <meta property="og:type" content="website" />
      </Head>


      <main style={{
        ...styles.main,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>
        <div
        style={{
          ...(styles.content as CSSProperties),
          position: 'relative',
          zIndex: 1,
        }}>
          <Logo />
          <h1 style={styles.title as CSSProperties}>Umang Patel</h1>
          <p style={styles.subtitle as CSSProperties}>Problem Solver & Occasional Bug Creator</p>

          <div style={styles.socialLinks as CSSProperties}>
            <a
              href="https://github.com/getumangon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg style={styles.socialIcon as CSSProperties} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
            </a>
          </div>

          <p style={styles.description as CSSProperties}>
            "From Browser Tabs to App Stores." Building the next generation of web and mobile apps with React Native and AI.
          </p>

          <div style={styles.navLinks as CSSProperties}>
            <a
              href={`/blog`}
              style={styles.navButton as CSSProperties}
            >
              blog

            <svg  style={styles.linkIcon as CSSProperties} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / External_Link"> <path id="Vector" 
              d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" 
              stroke={darkMode ? "#ffffffff" : "#000000ff"}
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"></path> </g> </g></svg>
            </a>
          </div>
        </div>
      </main>

    </section>
  );
}
