'use client';

import React, { useEffect, useRef, useState } from 'react';

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;

    constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.maxLife = 80 + Math.random() * 60;
        this.life = this.maxLife;
        this.size = 1 + Math.random() * 2;
        this.color = color;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.life <= 0) return;
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

export default function AetherRibbonMesh({ children }: { children?: React.ReactNode }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
        const particles: Particle[] = [];
        const clickRipple = { x: 0, y: 0, radius: 0, maxRadius: 400, speed: 14 };

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };

        const handlePointerMove = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            mouse.targetX = (clientX - rect.left) - width / 2;
            mouse.targetY = (clientY - rect.top) - height / 2;
            mouse.active = true;
        };

        const handlePointerLeave = () => {
            mouse.targetX = 0;
            mouse.targetY = 0;
            mouse.active = false;
        };

        const handlePointerDown = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

            clickRipple.x = clientX - rect.left;
            clickRipple.y = clientY - rect.top;
            clickRipple.radius = 0;

            const pColor = isDarkMode ? 'rgba(37, 99, 235, 0.85)' : 'rgba(56, 189, 248, 0.85)';
            for (let i = 0; i < 30; i++) {
                particles.push(new Particle(clickRipple.x, clickRipple.y, pColor));
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handlePointerMove);
        canvas.addEventListener('touchmove', handlePointerMove, { passive: true });
        canvas.addEventListener('mouseleave', handlePointerLeave);
        canvas.addEventListener('mousedown', handlePointerDown);
        canvas.addEventListener('touchstart', handlePointerDown, { passive: true });

        let lastTime = performance.now();
        let time = 0;

        const noise = (x: number, t: number, o: number) =>
            (Math.sin(x * 0.0012 + t * 0.25 + o) + Math.cos(x * 0.0028 - t * 0.4 + o * 2)) / 2;

        const render = (now: number) => {
            const dt = Math.min((now - lastTime) / 1000, 0.1);
            lastTime = now;
            time += dt * 0.85;

            const lerpFactor = 1 - Math.exp(-9 * dt);
            mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
            mouse.y += (mouse.targetY - mouse.y) * lerpFactor;

            const bgColor = isDarkMode ? '#1a1423' : '#1a1423'; // Matches var(--bg) of the site

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);
                if (p.life <= 0) particles.splice(i, 1);
            }

            if (clickRipple.radius < clickRipple.maxRadius) {
                clickRipple.radius += clickRipple.speed;
            }

            const layers = [
                { ribbonCount: 16, step: 4, offsetMod: 0, freqScale: 0.0035, ampScale: 55, speedScale: 1.1, primary: true },
                { ribbonCount: 10, step: 6, offsetMod: 1.2, freqScale: 0.0075, ampScale: 30, speedScale: 0.7, primary: false },
            ];

            layers.forEach((layer) => {
                ctx.globalCompositeOperation = layer.primary ? 'source-over' : 'screen';

                const gradient = ctx.createLinearGradient(0, 0, width, 0);
                if (isDarkMode) {
                    // Dark theme for NGO Site: Plums and Orchids
                    gradient.addColorStop(0, `rgba(122, 56, 181, ${layer.primary ? 0.15 : 0.03})`); // var(--plum)
                    gradient.addColorStop(0.5, `rgba(176, 112, 230, ${layer.primary ? 0.75 : 0.3})`); // var(--orchid)
                    gradient.addColorStop(1, `rgba(109, 40, 217, ${layer.primary ? 0.15 : 0.03})`);
                } else {
                    gradient.addColorStop(0, `rgba(56, 189, 248, ${layer.primary ? 0.1 : 0.02})`);
                    gradient.addColorStop(0.5, `rgba(96, 165, 250, ${layer.primary ? 0.8 : 0.35})`);
                    gradient.addColorStop(1, `rgba(168, 85, 247, ${layer.primary ? 0.1 : 0.02})`);
                }

                for (let r = 0; r < layer.ribbonCount; r++) {
                    const ribbonProgress = r / layer.ribbonCount;
                    // Start ribbons at y=0 (section top) so they're visible from the very first pixel below navbar
                    // The sine wave oscillation clips against the top edge naturally — no gap
                    const verticalSpread = 1.0 / layer.ribbonCount;
                    const yOffset = height * 0.0 + r * (height * verticalSpread) + layer.offsetMod * 35; 
                    const baseAlpha = (1 - ribbonProgress * 0.75) * (isDarkMode ? 0.8 : 0.65);

                    const rippleDistort =
                        clickRipple.radius < clickRipple.maxRadius
                            ? Math.sin((time * 2 + ribbonProgress * Math.PI) * 2) *
                            ((clickRipple.maxRadius / Math.max(clickRipple.radius, 1)) * 2.5)
                            : 0;

                    ctx.beginPath();

                    for (let x = 0; x <= width + layer.step; x += layer.step) {
                        const edgeEnvelope = Math.sin((x / width) * Math.PI);

                        const nFreq = 1 + noise(x, time, ribbonProgress) * 0.18;
                        const nAmp = 1 + noise(x * 2, -time, ribbonProgress * 0.5) * 0.15;

                        const wave1 =
                            Math.sin(x * (layer.freqScale * nFreq) + time * layer.speedScale + r * 0.18) *
                            (layer.ampScale * edgeEnvelope * nAmp);
                        const wave2 = Math.cos(x * 0.008 - time * 0.7 + r * 0.1) * (20 * edgeEnvelope);
                        const wave3 = Math.sin(x * 0.018 + time * 1.4) * (8 * edgeEnvelope);

                        const cursorXWorld = width / 2 + mouse.x;
                        const distToMouseX = Math.abs(x - cursorXWorld);
                        const mouseRadius = layer.primary ? 380 : 220;
                        const mouseFactor = Math.exp(-Math.pow(distToMouseX / mouseRadius, 2));
                        const mouseDisplacement =
                            Math.sin(x * 0.015 + time * 2.6) *
                            (mouseFactor * (layer.primary ? 50 : 25) * edgeEnvelope);

                        const rippleFactor = Math.exp(
                            -Math.pow(Math.abs(distToMouseX - clickRipple.radius) / (25 + rippleDistort), 2)
                        );
                        const rippleDisplacement = rippleFactor * rippleDistort * (1.8 - ribbonProgress);

                        const y =
                            yOffset +
                            wave1 +
                            wave2 +
                            wave3 +
                            mouseDisplacement +
                            rippleDisplacement +
                            mouse.y * (ribbonProgress * 0.1);

                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);

                        if (layer.primary && x % 48 === 0) {
                            ctx.fillStyle = isDarkMode ? 'rgba(176, 112, 230, 0.25)' : 'rgba(168, 85, 247, 0.3)';
                            ctx.fillRect(x - 1, y - 1, 2, 2);
                        }
                    }

                    ctx.globalAlpha = baseAlpha;
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = (layer.primary ? 1.4 : 0.8) + (1 - ribbonProgress) * 0.5;
                    ctx.stroke();
                }
            });

            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handlePointerMove);
            canvas.removeEventListener('touchmove', handlePointerMove);
            canvas.removeEventListener('mouseleave', handlePointerLeave);
            canvas.removeEventListener('mousedown', handlePointerDown);
            canvas.removeEventListener('touchstart', handlePointerDown);
        };
    }, [isDarkMode]);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    zIndex: 0,
                }}
            />
            {children && (
                <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
                    {children}
                </div>
            )}
        </>
    );
}
