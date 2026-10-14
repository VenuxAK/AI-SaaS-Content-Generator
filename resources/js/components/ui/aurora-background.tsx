import React, { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
    children?: React.ReactNode;
    className?: string;
    showRadialGradient?: boolean;
}

export function AuroraBackground({
    children,
    className = '',
    showRadialGradient = true,
}: AuroraBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
        let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = mouseX;
        let targetMouseY = mouseY;

        const handleResize = () => {
            if (!canvas || !canvas.parentElement) return;
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            targetMouseX = e.clientX - rect.left;
            targetMouseY = e.clientY - rect.top;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        let time = 0;

        // Colors: Violet, Indigo, Cyan, Fuchsia
        const colors = [
            { r: 99, g: 102, b: 241, a: 0.28 },  // indigo
            { r: 139, g: 92, b: 246, a: 0.22 }, // violet
            { r: 6, g: 182, b: 212, a: 0.18 },   // cyan
            { r: 217, g: 70, b: 239, a: 0.14 },  // fuchsia
        ];

        const render = () => {
            time += 0.008;

            // Smooth mouse interpolation
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            ctx.clearRect(0, 0, width, height);

            // Render 3 undulating layered wave ribbons
            for (let i = 0; i < colors.length; i++) {
                const color = colors[i];
                const waveOffset = (i * Math.PI) / 2;
                const speed = time * (1 + i * 0.2);

                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                gradient.addColorStop(
                    0.5,
                    `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
                );
                gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

                ctx.beginPath();
                ctx.moveTo(0, height);

                const step = 25;
                for (let x = 0; x <= width; x += step) {
                    const normX = x / width;
                    // Multi-frequency wave calculation
                    const wave1 = Math.sin(normX * 4 + speed + waveOffset) * (height * 0.18);
                    const wave2 = Math.cos(normX * 6 - speed * 0.8) * (height * 0.12);

                    // Cursor magnetic pull
                    const distToMouse = Math.abs(x - mouseX);
                    const mousePull = Math.max(0, 1 - distToMouse / (width * 0.4)) * ((mouseY - height * 0.5) * 0.3);

                    const y = height * 0.45 + wave1 + wave2 + mousePull;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute inset-0 h-full w-full opacity-90 transition-opacity duration-1000 dark:opacity-100"
            />
            {showRadialGradient && (
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(248,250,252,0.85)_75%)] dark:bg-[radial-gradient(circle_at_50%_20%,transparent_0%,rgba(7,8,14,0.92)_80%)]" />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
export default AuroraBackground;
