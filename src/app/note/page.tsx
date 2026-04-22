"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const FONTS = [
  { name: "Monospace", value: "monospace" },
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Verdana", value: "Verdana, sans-serif" },
];

const COLORS = [
  "#FFFFFF", "#000000", "#FF0000", "#00FF00",
  "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
  "#FFA500", "#800080", "#008000", "#000080",
  "#800000", "#808080", "#C0C0C0", "#FFB6C1",
];

const FONT_SIZES = Array.from({ length: 23 }, (_, i) => 20 + i * 4);

export default function NotePage() {
  const messageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showFontList, setShowFontList] = useState(false);
  const [showSizeList, setShowSizeList] = useState(false);
  const [showColorList, setShowColorList] = useState(false);
  const [fontSize, setFontSizeState] = useState(36);
  const currentSizeRef = useRef(36);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [selectedFont, setSelectedFont] = useState("monospace");
  const DEFAULT_SIZE = 36;
  const [selectedSize, setSelectedSize] = useState(36);

  useEffect(() => {
    const messageDiv = messageRef.current;
    if (!messageDiv) return;

    const savedContent = sessionStorage.getItem("noteContent");
    if (savedContent) {
      messageDiv.innerHTML = savedContent;
    } else {
      messageDiv.innerHTML =
        "Got a thought? Jot it down here! (P.S. Your notes stay right here in your browser and won't be sent anywhere)";
    }

    const handleInput = () => {
      if (messageDiv) {
        sessionStorage.setItem("noteContent", messageDiv.innerHTML);
      }
    };

    messageDiv.addEventListener("input", handleInput);
    messageDiv.focus();

    return () => {
      messageDiv.removeEventListener("input", handleInput);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "=") {
        e.preventDefault();
        adjustFontSize(2);
      } else if ((e.metaKey || e.ctrlKey) && e.key === "-") {
        e.preventDefault();
        adjustFontSize(-2);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const messageDiv = messageRef.current;
    if (!messageDiv) return;

    const updateStates = () => {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
      const color = document.queryCommandValue("foreColor");
      if (color) setTextColor(color);
      const font = document.queryCommandValue("fontName");
      if (font) setSelectedFont(font);
      const sizeSpan = document.queryCommandValue("fontSize");
      if (sizeSpan) setSelectedSize(parseInt(sizeSpan) * 4);
    };

    messageDiv.addEventListener("keyup", updateStates);
    messageDiv.addEventListener("mouseup", updateStates);
    messageDiv.addEventListener("input", updateStates);

    return () => {
      messageDiv.removeEventListener("keyup", updateStates);
      messageDiv.removeEventListener("mouseup", updateStates);
      messageDiv.removeEventListener("input", updateStates);
    };
  }, []);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(20, Math.min(108, currentSizeRef.current + delta));
    currentSizeRef.current = newSize;
    setFontSizeState(newSize);
    setSelectedSize(newSize);
    if (messageRef.current) {
      messageRef.current.style.fontSize = `${newSize}px`;
      sessionStorage.setItem("noteContent", messageRef.current.innerHTML);
    }
  };

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    messageRef.current?.focus();
    setTimeout(() => {
      setIsBold(document.queryCommandState("bold"));
      setIsItalic(document.queryCommandState("italic"));
      setIsUnderline(document.queryCommandState("underline"));
      setSelectedSize(currentSizeRef.current);
    }, 0);
  };

  const applyFontSize = (size: number) => {
    messageRef.current?.focus();

    if (messageRef.current) {
      messageRef.current.style.fontSize = `${size}px`;
      currentSizeRef.current = size;
      setFontSizeState(size);
      setSelectedSize(size);
      sessionStorage.setItem("noteContent", messageRef.current.innerHTML);
    }
    setShowSizeList(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();

    const resize = (moveEvent: MouseEvent) => {
      if (containerRef.current) {
        containerRef.current.style.width = `${
          moveEvent.clientX - containerRef.current.offsetLeft
        }px`;
      }
    };

    const stopResize = () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const ToolButton = ({
    onClick,
    children,
    title,
    active,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    active?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? textColor : "transparent",
        border: active ? `2px solid ${textColor}` : "1px solid var(--text-color)",
        borderRadius: "4px",
        color: active && (textColor === "#FFFFFF" || textColor === "#FFFF00" || textColor === "#00FFFF") ? "#000000" : (active ? textColor : "var(--text-color)"),
        cursor: "pointer",
        marginBottom: "8px",
        fontSize: "14px",
      }}
    >
      {children}
    </button>
  );

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-18238Y9WWV"
        strategy="afterInteractive"
      />
      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-18238Y9WWV');
        `}
      </Script>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "100vh",
          paddingTop: "7vh",
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <div
          ref={containerRef}
          style={{
            position: "relative",
            display: "inline-block",
            width: "80%",
            maxWidth: "100%",
            background: "rgba(128, 128, 128, 0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "12px",
            border: "1px solid rgba(128, 128, 128, 0.3)",
            padding: "20px",
            marginBottom: "40px"
          }}
        >
          <div
            ref={messageRef}
            contentEditable
            suppressContentEditableWarning
            style={{
              fontFamily: "monospace",
              fontSize: `${fontSize}px`,
              lineHeight: 1.5,
              outline: "none",
              minHeight: "80vh",
            }}
          />
          <div
            onMouseDown={handleResizeStart}
            style={{
              width: "5px",
              height: "100%",
              cursor: "ew-resize",
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              backgroundColor: "transparent",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(135, 206, 235, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          />
        </div>
        <div
          style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 100,
          }}
        >
          <ToolButton onClick={() => execCmd("bold")} title="Bold" active={isBold}>
            <strong>B</strong>
          </ToolButton>
          <ToolButton onClick={() => execCmd("italic")} title="Italic" active={isItalic}>
            <em>I</em>
          </ToolButton>
          <ToolButton onClick={() => execCmd("underline")} title="Underline" active={isUnderline}>
            <u>U</u>
          </ToolButton>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowSizeList(!showSizeList);
                setShowFontList(false);
                setShowColorList(false);
              }}
              title="Font Size"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "1px solid var(--text-color)",
                borderRadius: "4px",
                color: "var(--text-color)",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
            Sz
            </button>
            {showSizeList && (
              <div
                style={{
                  position: "absolute",
                  right: "44px",
                  top: 0,
                  background: "var(--bg-color)",
                  border: "1px solid var(--text-color)",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  minWidth: "50px",
                }}
              >
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => applyFontSize(size)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 10px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-color)",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowFontList(!showFontList);
                setShowSizeList(false);
                setShowColorList(false);
              }}
              title="Font Family"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: selectedFont !== "monospace" ? "2px solid var(--text-color)" : "1px solid var(--text-color)",
                borderRadius: "4px",
                color: "var(--text-color)",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: selectedFont !== "monospace" ? selectedFont : "monospace",
              }}
            >
              Ft
            </button>
            {showFontList && (
              <div
                style={{
                  position: "absolute",
                  right: "44px",
                  top: 0,
                  background: "var(--bg-color)",
                  border: "1px solid var(--text-color)",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  minWidth: "120px",
                }}
              >
                {FONTS.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => {
                      execCmd("fontName", font.value);
                      setShowFontList(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "6px 10px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-color)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: font.value,
                    }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                setShowColorList(!showColorList);
                setShowFontList(false);
                setShowSizeList(false);
              }}
              title="Text Color"
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: textColor,
                border: textColor !== "#000000" ? "2px solid var(--text-color)" : "1px solid var(--text-color)",
                borderRadius: "4px",
                color: textColor === "#FFFFFF" || textColor === "#FFFF00" || textColor === "#00FFFF" ? "#000000" : "#FFFFFF",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              A
            </button>
            {showColorList && (
              <div
                style={{
                  position: "absolute",
                  right: "44px",
                  top: 0,
                  background: "var(--bg-color)",
                  border: "1px solid var(--text-color)",
                  borderRadius: "4px",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "4px",
                  padding: "8px",
                }}
              >
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      execCmd("foreColor", color);
                      setTextColor(color);
                      setShowColorList(false);
                    }}
                    style={{
                      width: "24px",
                      height: "24px",
                      background: color,
                      border: textColor === color ? "2px solid var(--text-color)" : "1px solid var(--text-color)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
