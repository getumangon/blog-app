"use client";

import Lottie from 'lottie-react';
import codeAnimation from "./code_animation.json";
import whiteCodeAnimation from "./white_code_animation.json";
import { useTheme } from '@/app/context/ThemeContext';

const Logo = () => {
  const { darkMode } = useTheme();

  return (
    <>
      {
        !darkMode ?
          <Lottie style={{ height: '14rem', width: '14rem' }} animationData={codeAnimation} loop={true} />
          : 
          <Lottie style={{ height: '14rem', width: '14rem' }} animationData={whiteCodeAnimation} loop={true} />
      }
     </>
  );
};

export default Logo;
