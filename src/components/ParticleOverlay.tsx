import React, { useEffect, useRef } from "react";

interface ParticleOverlayProps {
  isDarkMode?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
  color: string;
  swaySpeed: number;
  swayOffset: number;
  shape: "circle" | "sparkle" | "petal";
  rotation: number;
  rotationSpeed: number;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ isDarkMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particle colors based on dark/light aesthetic (soft rose, warm gold, pastel pink, white)
    const getColors = () => {
      return isDarkMode
        ? [
            "rgba(255, 182, 193, ", // Light Pink
            "rgba(255, 105, 180, ", // Hot Pink
            "rgba(244, 114, 182, ", // Rose Pink
            "rgba(253, 244, 245, ", // Sakura White
            "rgba(224, 73, 114, "   // Deep Blossom
          ]
        : [
            "rgba(251, 113, 133, ",
            "rgba(244, 63, 94, ",
            "rgba(245, 158, 11, ",
            "rgba(244, 114, 182, ",
            "rgba(225, 29, 72, "
          ];
    };

    const particleCount = Math.min(Math.floor((width * height) / 12000), 90);
    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const colors = getColors();
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 3.5 + 1.5; // Slightly larger for beautiful petal visuals (1.5px - 5.0px)
      const maxOpacity = Math.random() * 0.7 + 0.3;

      let shape: "circle" | "sparkle" | "petal" = "circle";
      const rand = Math.random();
      if (isDarkMode) {
        // High density of petals in Dark Mode!
        if (rand < 0.75) {
          shape = "petal";
        } else if (rand < 0.9) {
          shape = "sparkle";
        } else {
          shape = "circle";
        }
      } else {
        if (rand < 0.4) {
          shape = "petal";
        } else if (rand < 0.7) {
          shape = "sparkle";
        } else {
          shape = "circle";
        }
      }

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : -15 - Math.random() * 25,
        size,
        speedY: Math.random() * 0.9 + 0.45, // Gentle downward speed
        speedX: (Math.random() - 0.4) * 0.45, // Slight eastward drift for windy feel
        opacity: Math.random() * maxOpacity,
        maxOpacity,
        fadeSpeed: Math.random() * 0.006 + 0.002,
        color: colorBase,
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayOffset: Math.random() * Math.PI * 2,
        shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(Math.random() * height));
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * p.swaySpeed + p.swayOffset) * 0.4;
        p.rotation += p.rotationSpeed;

        // Pulsing opacity
        p.opacity += p.fadeSpeed;
        if (p.opacity >= p.maxOpacity || p.opacity <= 0.15) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        // Reset if out of bounds
        if (p.y > height + 15 || p.x < -30 || p.x > width + 30) {
          particles[index] = createParticle();
        }

        ctx.save();
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowColor = p.color + "0.6)";
        ctx.shadowBlur = p.size * 1.5;

        if (p.shape === "sparkle") {
          // Draw a tiny 4-point sparkle
          ctx.beginPath();
          const r = p.size * 1.8;
          ctx.moveTo(p.x, p.y - r);
          ctx.lineTo(p.x + r * 0.3, p.y - r * 0.3);
          ctx.lineTo(p.x + r, p.y);
          ctx.lineTo(p.x + r * 0.3, p.y + r * 0.3);
          ctx.moveTo(p.x, p.y + r);
          ctx.lineTo(p.x - r * 0.3, p.y + r * 0.3);
          ctx.lineTo(p.x - r, p.y);
          ctx.lineTo(p.x - r * 0.3, p.y - r * 0.3);
          ctx.fill();
        } else if (p.shape === "petal") {
          // Draw a beautiful organic cherry blossom petal with rotation
          ctx.beginPath();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          
          // Cherry blossom petal curve
          ctx.moveTo(0, -p.size * 1.5);
          ctx.bezierCurveTo(-p.size * 2, -p.size * 2, -p.size * 1.8, p.size * 1.2, 0, p.size * 2.2);
          ctx.bezierCurveTo(p.size * 1.8, p.size * 1.2, p.size * 2, -p.size * 2, 0, -p.size * 1.5);
          
          ctx.fill();
        } else {
          // Draw tiny circle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};
