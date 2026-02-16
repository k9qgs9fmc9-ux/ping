import React, { useEffect, useRef } from 'react';
import { THEME_COLORS, THEMES } from '../config/themes';

const TechBackground = ({ theme = THEMES.TECH }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const themeColors = THEME_COLORS[theme];
    const isDark = theme !== THEMES.GRAND;
    
    const particles = [];
    const particleCount = isDark ? 80 : 60;

    // Get theme-specific colors
    const getParticleColors = () => {
      switch (theme) {
        case THEMES.DEFAULT:
          return ['#0062ff', '#722ed1'];
        case THEMES.GRAND:
          return ['#1a365d', '#2c5282', '#d4af37'];
        case THEMES.TECH:
          return ['#00d4ff', '#0066ff', '#00ff88'];
        case THEMES.COOL:
          return ['#ff006e', '#8338ec', '#3a86ff'];
        case THEMES.FUSION:
          return ['#6366f1', '#8b5cf6', '#06b6d4', '#ff006e'];
        default:
          return ['#0062ff', '#722ed1'];
      }
    };

    const colors = getParticleColors();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isDark ? 0.5 : 0.3);
        this.vy = (Math.random() - 0.5) * (isDark ? 0.5 : 0.3);
        this.size = Math.random() * (isDark ? 3 : 2) + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.3 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        
        // Add glow effect for dark themes
        if (isDark) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawGrid = () => {
      const gridColor = isDark 
        ? themeColors?.primary?.replace('#', '') || '00d4ff'
        : '0, 98, 255';
      
      ctx.strokeStyle = isDark 
        ? `rgba(${parseInt(gridColor.substr(0, 2), 16)}, ${parseInt(gridColor.substr(2, 2), 16)}, ${parseInt(gridColor.substr(4, 2), 16)}, 0.05)`
        : 'rgba(0, 98, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      const gridSize = 40;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      drawGrid();

      // Connect particles
      particles.forEach((p, index) => {
        p.update();
        p.draw();

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < (isDark ? 200 : 150)) {
            ctx.beginPath();
            ctx.shadowBlur = 0;
            const lineOpacity = isDark 
              ? 0.15 * (1 - distance / 200)
              : 0.08 * (1 - distance / 150);
            ctx.strokeStyle = p.color.replace(')', `, ${lineOpacity})`).replace('rgb', 'rgba').replace('#', '');
            // Convert hex to rgba
            const r = parseInt(p.color.substr(1, 2), 16);
            const g = parseInt(p.color.substr(3, 2), 16);
            const b = parseInt(p.color.substr(5, 2), 16);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
            ctx.lineWidth = isDark ? 0.8 : 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default TechBackground;
