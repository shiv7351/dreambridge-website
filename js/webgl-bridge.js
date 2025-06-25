// DreamBridge Media - WebGL Bridge Animation

class WebGLBridge {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.vertices = [];
        this.indices = [];
        this.animationId = null;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.canvas = document.getElementById('bridge-canvas');
        if (!this.canvas) {
            console.log('Bridge canvas not found');
            return;
        }

        this.setupCanvas();
        this.initWebGL();
        this.createShaders();
        this.createBridge();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
        
        this.isInitialized = true;
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Make canvas responsive
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            if (this.gl) {
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
        });
    }

    initWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        
        if (!this.gl) {
            console.log('WebGL not supported, falling back to canvas animation');
            this.fallbackAnimation();
            return;
        }

        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }

    createShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_alpha;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            varying float v_alpha;
            
            void main() {
                vec2 position = a_position;
                
                // Add wave effect based on time and mouse position
                float wave = sin(position.x * 0.01 + u_time * 0.002) * 0.1;
                float mouseInfluence = distance(position, u_mouse) / 500.0;
                position.y += wave * (1.0 - mouseInfluence);
                
                // Convert to clip space
                vec2 clipSpace = ((position / u_resolution) * 2.0) - 1.0;
                gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
                
                v_alpha = a_alpha * (0.3 + 0.7 * sin(u_time * 0.003 + position.x * 0.01));
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform float u_time;
            varying float v_alpha;
            
            void main() {
                vec3 color1 = vec3(0.39, 0.40, 0.94); // #6366f1
                vec3 color2 = vec3(0.93, 0.28, 0.60); // #ec4899
                vec3 color3 = vec3(0.02, 0.71, 0.84); // #06b6d4
                
                float mixer = sin(u_time * 0.002) * 0.5 + 0.5;
                vec3 finalColor = mix(mix(color1, color2, mixer), color3, sin(u_time * 0.001) * 0.5 + 0.5);
                
                gl_FragColor = vec4(finalColor, v_alpha * 0.4);
            }
        `;

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Shader program failed to link');
            return;
        }

        this.gl.useProgram(this.program);
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createBridge() {
        // Create bridge-like structure with curves
        this.vertices = [];
        this.indices = [];
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const bridgeWidth = Math.min(this.canvas.width * 0.8, 800);
        const bridgeHeight = 150;
        
        // Main bridge arc
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = centerX - bridgeWidth / 2 + t * bridgeWidth;
            const y = centerY - Math.sin(t * Math.PI) * bridgeHeight;
            
            // Main bridge line
            this.vertices.push(x, y, 0.8); // x, y, alpha
            
            // Support cables
            if (i % 5 === 0) {
                this.vertices.push(x, y, 0.6);
                this.vertices.push(x, centerY + bridgeHeight, 0.4);
            }
        }
        
        // Create connection lines (indices)
        for (let i = 0; i < segments; i++) {
            this.indices.push(i, i + 1);
        }
    }

    createParticles() {
        this.particles = [];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                alpha: Math.random() * 0.5 + 0.2,
                size: Math.random() * 3 + 1
            });
        }
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        // Theme change listener
        document.addEventListener('themeChanged', (e) => {
            this.updateTheme(e.detail.theme);
        });
    }

    animate() {
        this.time += 16; // ~60fps
        
        if (this.gl) {
            this.renderWebGL();
        } else {
            this.renderCanvas();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    renderWebGL() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Create buffer for vertices
        const vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        
        // Set up attributes
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const alphaLocation = this.gl.getAttribLocation(this.program, 'a_alpha');
        
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.enableVertexAttribArray(alphaLocation);
        
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 12, 0);
        this.gl.vertexAttribPointer(alphaLocation, 1, this.gl.FLOAT, false, 12, 8);
        
        // Set uniforms
        const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        const mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
        
        this.gl.uniform1f(timeLocation, this.time);
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(mouseLocation, this.mouseX, this.mouseY);
        
        // Draw bridge
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.vertices.length / 3);
        
        // Render particles
        this.renderParticles();
    }

    renderParticles() {
        // Update and render particles using WebGL
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse attraction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
            }
        });
    }

    // Fallback Canvas 2D animation for non-WebGL browsers
    fallbackAnimation() {
        const ctx = this.canvas.getContext('2d');
        
        const animate = () => {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw bridge with canvas
            this.drawBridgeCanvas(ctx);
            this.drawParticlesCanvas(ctx);
            
            this.time += 16;
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    drawBridgeCanvas(ctx) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const bridgeWidth = Math.min(this.canvas.width * 0.8, 800);
        const bridgeHeight = 150;
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.3)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.3)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        
        // Draw main bridge arc
        ctx.beginPath();
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            const x = centerX - bridgeWidth / 2 + t * bridgeWidth;
            const y = centerY - Math.sin(t * Math.PI) * bridgeHeight + Math.sin(this.time * 0.002 + t * 5) * 10;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
        
        // Draw support cables
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.6;
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const x = centerX - bridgeWidth / 2 + t * bridgeWidth;
            const y1 = centerY - Math.sin(t * Math.PI) * bridgeHeight;
            const y2 = centerY + bridgeHeight;
            
            ctx.beginPath();
            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    drawParticlesCanvas(ctx) {
        this.particles.forEach(particle => {
            // Update particle position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Mouse interaction
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
                particle.alpha = Math.min(1, particle.alpha + 0.02);
            } else {
                particle.alpha = Math.max(0.2, particle.alpha - 0.01);
            }
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = '#6366f1';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#6366f1';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    updateTheme(theme) {
        // Update colors based on theme
        if (theme === 'dark') {
            // Enhance glow effects for dark theme
            this.particles.forEach(particle => {
                particle.alpha *= 1.2;
            });
        } else {
            // Reduce intensity for light theme
            this.particles.forEach(particle => {
                particle.alpha *= 0.8;
            });
        }
    }

    // Bridge building animation (triggered on scroll or interaction)
    animateBridgeBuilding() {
        if (!this.isInitialized) return;
        
        // Progressive bridge building effect
        let segmentIndex = 0;
        const buildInterval = setInterval(() => {
            if (segmentIndex < this.vertices.length / 3) {
                // Gradually reveal bridge segments
                if (this.vertices[segmentIndex * 3 + 2] !== undefined) {
                    this.vertices[segmentIndex * 3 + 2] = Math.min(1, this.vertices[segmentIndex * 3 + 2] + 0.1);
                }
                segmentIndex++;
            } else {
                clearInterval(buildInterval);
            }
        }, 100);
    }

    // Particle burst effect
    createParticleBurst(x, y) {
        const burstCount = 20;
        for (let i = 0; i < burstCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                alpha: 1,
                size: Math.random() * 4 + 2,
                life: 60 // frames
            });
        }
    }

    // Cleanup
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
        
        this.isInitialized = false;
    }
}

// Initialize WebGL Bridge
function initBridge() {
    if (typeof window !== 'undefined') {
        window.webglBridge = new WebGLBridge();
        
        // Trigger bridge building animation on scroll to services
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && window.webglBridge) {
                        window.webglBridge.animateBridgeBuilding();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(servicesSection);
        }
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
} else {
    initBridge();
}

// Export for global use
window.WebGLBridge = WebGLBridge;
window.initBridge = initBridge;
