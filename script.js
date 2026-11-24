// Minimal Script for Sai Charan Amith - Game Developer Portfolio with hover-animated pixel doll
document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 1.5. Navbar Interactions (Mobile Menu Toggle & Scrollspy Active Links)
  // =========================================================================
  initNavbar();

  // =========================================================================
  // 2. Hover-animated Detailed Pixel Doll Engine
  // =========================================================================
  initInteractiveDoll();

  // =========================================================================
  // 3. Interactive Portfolio Visual Cards (Subtle 3D Parallax Tilt)
  // =========================================================================
  const visualFrames = document.querySelectorAll('.portfolio-visual-frame');
  visualFrames.forEach(frame => {
    let bounds;

    frame.addEventListener('mouseenter', () => {
      bounds = frame.getBoundingClientRect();
      frame.style.transition = 'transform 0.1s ease-out, box-shadow 0.25s ease, border-color 0.25s ease';
    });

    frame.addEventListener('mousemove', (e) => {
      if (!bounds) bounds = frame.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const xPct = (mouseX / bounds.width - 0.5) * 2;
      const yPct = (mouseY / bounds.height - 0.5) * 2;

      const rotateX = -yPct * 5;
      const rotateY = xPct * 5;

      frame.style.transform = `perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;

      const innerSvg = frame.querySelector('svg');
      if (innerSvg) {
        innerSvg.style.transform = `translate(${(-xPct * 4).toFixed(1)}px, ${(-yPct * 4).toFixed(1)}px) scale(1.03)`;
      }
    });

    frame.addEventListener('mouseleave', () => {
      frame.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
      frame.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px)';

      const innerSvg = frame.querySelector('svg');
      if (innerSvg) {
        innerSvg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        innerSvg.style.transform = 'translate(0px, 0px) scale(1)';
      }
    });
  });

  // =========================================================================
  // 4. Connect Form Web3Forms Integration
  // =========================================================================
  const form = document.getElementById('connect-form');
  const status = document.getElementById('form-status');
  const WEB3FORMS_ACCESS_KEY = '2fd21346-f4b5-408b-8233-6cb33a4c4cdb';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate required fields
      let isValid = true;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      // Show status area
      status.style.display = 'block';

      if (!name) {
        status.textContent = 'Please enter your name.';
        status.style.color = 'var(--olive-dark)';
        isValid = false;
      } else if (!email) {
        status.textContent = 'Please enter your email address.';
        status.style.color = 'var(--olive-dark)';
        isValid = false;
      } else if (!subject) {
        status.textContent = 'Please enter a subject.';
        status.style.color = 'var(--olive-dark)';
        isValid = false;
      } else if (!message) {
        status.textContent = 'Please enter a message.';
        status.style.color = 'var(--olive-dark)';
        isValid = false;
      }

      if (!isValid) {
        // Hide status after 5 seconds
        setTimeout(() => {
          status.style.display = 'none';
        }, 5000);
        return;
      }

      // Show loading state
      status.textContent = 'Sending your message...';
      status.style.color = 'var(--olive)';
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;

      // Web3Forms automatically handles the submission
      // The access key in the action URL authenticates the request
      // Visitor's email will be included as Reply-To automatically
      const formData = new FormData(form);

      // Submit via fetch to Web3Forms API with JSON
      const formObject = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        subject: form.subject.value.trim(),
        message: form.message.value.trim()
      };

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formObject)
      })
      .then(response => {
        // Log the full response for debugging
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(json => {
            console.log("Web3Forms JSON response:", json);
            return json;
          });
        }
        console.log("Web3Forms response status:", response.status);
        return response.text().then(text => {
          console.log("Web3Forms response text:", text);
          return { text, status: response.status };
        });
      })
      .then(data => {
        if (data.status >= 200 && data.status < 300 || data.success) {
          // Success state
          form.reset();
          status.textContent = 'Thank you! Your message has been sent successfully.';
          status.style.color = 'var(--olive-dark)';
          btn.disabled = false;

          setTimeout(() => {
            status.style.display = 'none';
          }, 5000);
        } else {
          // Error from Web3Forms - show actual error message
          status.textContent = data.text || data.message || 'Failed to send message. Please try again.';
          status.style.color = 'var(--olive-dark)';
          btn.disabled = false;

          setTimeout(() => {
            status.style.display = 'none';
          }, 5000);
        }
      })
      .catch((error) => {
        // Error state - show actual error
        console.error("Web3Forms fetch error:", error);
        status.textContent = 'Failed to send message. Please try again. ' + error.message;
        status.style.color = 'var(--olive-dark)';
        btn.disabled = false;

        setTimeout(() => {
          status.style.display = 'none';
        }, 5000);
      });
    });
  }
});

// =========================================================================
// Detailed Pixel Doll with hover-driven animation
// =========================================================================
function initInteractiveDoll() {
  const canvas = document.getElementById('doll-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Palette with rich shading
  const PAL = {
    hairDark: '#765718',
    hairBase: '#A67A20',
    hairLight: '#C99A31',
    skinBase: '#F7D8B1',
    skinLight: '#FFE6C9',
    skinShadow: '#E6B985',
    blush: '#E9B58C',
    glassesFrame: '#E9F7F7',
    glassesRim: '#D8EEEE',
    eyes: '#20282B',
    mouth: '#D99A70',
    shirtBase: '#1D2222',
    shirtLight: '#363C3B',
    shirtShadow: '#111617',
    shirtStripe: '#9B9D9B',
    stripeShadow: '#6D7170',
    collar: '#D9DAD7',
    pantsBase: '#102432',
    pantsShadow: '#09151E',
    pantsLight: '#1C394A',
    shoesBase: '#F3F4EF',
    shoesStripe: '#C8CBC7',
    shoesSole: '#B9BFBC',
    consoleBase: '#263A3D',
    consoleScreen: '#A4BF94',
    consoleScreenLight: '#C3DEB5'
  };

  // State Management
  const ACTIONS = ['stand', 'walk', 'sit', 'play'];
  let currentAction = 'stand';
  let time = 0;
  let walkX = 40;
  let walkDir = 1;
  let facing = 1;

  // Particle System
  const particles = [];
  function spawnParticle(x, y, vx, vy, color, char, life = 1) {
    particles.push({ x, y, vx, vy, color, char, life, maxLife: life });
  }

  // DOM Elements
  const captionEl = document.getElementById('doll-caption');
  const dollWrapper = document.getElementById('doll-wrapper');
  let isHovered = false;

  function updateActionUI(action) {
    currentAction = action;

    if (captionEl) {
      const captions = {
        stand: 'Sai Charan is standing ready',
        walk: 'Sai Charan is taking a stroll',
        sit: 'Sai Charan is sitting & thinking',
        play: 'Sai Charan is playing on his handheld!'
      };
      captionEl.textContent = captions[action] || captions.stand;
    }
  }

  // Motion is deliberately hover-driven so the character stays still at rest.
  if (dollWrapper) {
    dollWrapper.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    dollWrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      particles.length = 0;
    });

    const cycleAction = () => {
      const nextIndex = (ACTIONS.indexOf(currentAction) + 1) % ACTIONS.length;
      updateActionUI(ACTIONS[nextIndex]);
    };
    dollWrapper.addEventListener('click', cycleAction);
    dollWrapper.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        cycleAction();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
    const index = Number(event.key) - 1;
    if (index >= 0 && index < ACTIONS.length) {
      updateActionUI(ACTIONS[index]);
    }
  });

  // =========================================================================
  // MAIN ANIMATION LOOP
  // =========================================================================
  function renderDoll() {
    if (isHovered) time += 0.04;
    ctx.clearRect(0, 0, 80, 80);

    let baseCharX = 40;
    let baseCharY = 22;
    const isBlinking = (Math.floor(time * 0.7) % 6 === 0) && (Math.sin(time * 9) > 0.6);

    // Behavior updates
    if (isHovered && currentAction === 'walk') {
      walkX += walkDir * 0.48;
      if (walkX > 56) { walkDir = -1; facing = -1; }
      if (walkX < 24) { walkDir = 1; facing = 1; }
      baseCharX = Math.round(walkX);

      // Dust particles at shoes
      if (Math.random() < 0.16) {
        spawnParticle(baseCharX + (facing === 1 ? -6 : 6), 66, -walkDir * 0.4, -0.2, '#DED8CD', null, 0.6);
      }
    } else if (currentAction === 'sit') {
      baseCharX = 40;
      baseCharY = 30; // lower down
      facing = 1;
    } else if (currentAction === 'play') {
      baseCharX = 40;
      baseCharY = 22;
      facing = 1;

      // Floating retro pixel symbols
      if (Math.random() < 0.09) {
        const symbols = ['★', '♪', '♦', '+'];
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        spawnParticle(baseCharX + (Math.random() - 0.5) * 14, baseCharY + 14, (Math.random() - 0.5) * 0.4, -0.5, '#5B6E4E', sym, 1.2);
      }
    } else {
      // Stand
      baseCharX = 40;
      baseCharY = 22 + (isHovered ? Math.round(Math.sin(time * 2.5) * 0.6) : 0);
      facing = 1;
    }

    // Render Character
    ctx.save();
    ctx.translate(baseCharX, baseCharY);
    ctx.scale(1.2, 1.2);
    if (facing === -1) {
      ctx.scale(-1, 1);
    }

    if (currentAction === 'sit') {
      drawDetailedSitting(ctx, PAL, isBlinking, time);
    } else if (currentAction === 'play') {
      drawDetailedPlaying(ctx, PAL, isBlinking, time);
    } else if (currentAction === 'walk' && isHovered) {
      drawDetailedWalking(ctx, PAL, isBlinking, time);
    } else {
      drawDetailedStanding(ctx, PAL, isBlinking, time);
    }

    ctx.restore();

    // Render Floating Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      if (p.char) {
        ctx.fillStyle = p.color;
        ctx.font = '8px monospace';
        ctx.fillText(p.char, Math.round(p.x), Math.round(p.y));
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
      }
      ctx.restore();
    }

    requestAnimationFrame(renderDoll);
  }

  // =========================================================================
  // DETAILED CHARACTER POSES (Rich Shading & Texture)
  // =========================================================================

  function drawHead(ctx, PAL, isBlinking, bob, lookY = 0) {
    // Layered swept hair
    ctx.fillStyle = PAL.hairDark;
    ctx.fillRect(-8, -21 + bob, 14, 3);
    ctx.fillRect(-11, -18 + bob, 19, 5);
    ctx.fillRect(-12, -14 + bob, 5, 9);
    ctx.fillRect(7, -16 + bob, 4, 10);

    // Hair gold midtone and highlights
    ctx.fillStyle = PAL.hairBase;
    ctx.fillRect(-7, -20 + bob, 13, 5);
    ctx.fillRect(-9, -16 + bob, 17, 5);
    ctx.fillRect(-9, -12 + bob, 3, 7);
    ctx.fillRect(7, -14 + bob, 2, 7);
    ctx.fillStyle = PAL.hairLight;
    ctx.fillRect(-4, -20 + bob, 8, 2);
    ctx.fillRect(-7, -16 + bob, 7, 2);
    ctx.fillRect(1, -16 + bob, 5, 2);

    // Face
    ctx.fillStyle = PAL.skinBase;
    ctx.fillRect(-7, -12 + bob, 14, 12);
    ctx.fillRect(-8, -8 + bob, 1, 5);
    ctx.fillRect(7, -8 + bob, 1, 5);
    ctx.fillStyle = PAL.skinShadow;
    ctx.fillRect(-7, -12 + bob, 14, 1);
    ctx.fillRect(-7, -1 + bob, 14, 1);

    // Sunglasses
    ctx.fillStyle = PAL.blush;
    ctx.fillRect(-6, -4 + bob, 2, 1);
    ctx.fillRect(4, -4 + bob, 2, 1);
    ctx.fillStyle = PAL.glassesFrame;
    ctx.fillRect(-7, -10 + bob, 14, 4);
    ctx.fillStyle = PAL.glassesRim;
    ctx.fillRect(-6, -9 + bob, 4, 2);
    ctx.fillRect(2, -9 + bob, 4, 2);
    ctx.fillRect(-1, -9 + bob, 2, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-6, -9 + bob, 1, 1);
    ctx.fillRect(2, -9 + bob, 1, 1);

    // Nose, smile, and collar
    ctx.fillStyle = PAL.skinShadow;
    ctx.fillRect(-1, -5 + bob, 2, 1);
    ctx.fillStyle = PAL.mouth;
    ctx.fillRect(-3, -3 + bob, 6, 1);
    ctx.fillRect(-4, -4 + bob, 1, 1);
    ctx.fillRect(3, -4 + bob, 1, 1);

    // Neck with White Inner Collar V-neck
    ctx.fillStyle = PAL.skinShadow;
    ctx.fillRect(-3, 0 + bob, 6, 2);
    ctx.fillStyle = PAL.collar;
    ctx.fillRect(-2, 1 + bob, 4, 2);
  }

  function drawDetailedStanding(ctx, PAL, isBlinking, t) {
    const bob = Math.round(Math.sin(t * 3) * 0.6);

    // Head
    drawHead(ctx, PAL, isBlinking, bob, 0);

    // Torso - Olive Shirt Base & Shading
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-9, 3 + bob, 18, 14);

    // Shirt Highlights on Shoulders
    ctx.fillStyle = PAL.shirtLight;
    ctx.fillRect(-8, 3 + bob, 16, 2);
    // Shirt Shadow on Sides
    ctx.fillStyle = PAL.shirtShadow;
    ctx.fillRect(-9, 5 + bob, 1, 12);
    ctx.fillRect(8, 5 + bob, 1, 12);

    // White Horizontal Athletic Stripe
    ctx.fillStyle = PAL.shirtStripe;
    ctx.fillRect(-9, 7 + bob, 18, 3);
    ctx.fillStyle = PAL.stripeShadow;
    ctx.fillRect(-9, 10 + bob, 18, 1);

    // Left Arm
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-12, 3 + bob, 3, 9);
    ctx.fillStyle = PAL.shirtShadow;
    ctx.fillRect(-12, 11 + bob, 3, 1);
    ctx.fillStyle = PAL.skinBase;
    ctx.fillRect(-12, 12 + bob, 3, 4);

    // Right Arm
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(9, 3 + bob, 3, 9);
    ctx.fillStyle = PAL.shirtShadow;
    ctx.fillRect(9, 11 + bob, 3, 1);
    ctx.fillStyle = PAL.skinBase;
    ctx.fillRect(9, 12 + bob, 3, 4);

    // Denim Pants
    ctx.fillStyle = PAL.pantsBase;
    ctx.fillRect(-8, 17, 16, 18);
    // Center fold & shadow
    ctx.fillStyle = PAL.pantsShadow;
    ctx.fillRect(-1, 20, 2, 15);
    ctx.fillRect(-8, 33, 2, 2);
    ctx.fillRect(6, 33, 2, 2);
    // Knee highlight
    ctx.fillStyle = PAL.pantsLight;
    ctx.fillRect(-6, 27, 3, 2);
    ctx.fillRect(3, 27, 3, 2);

    // Sneakers
    ctx.fillStyle = PAL.shoesBase;
    ctx.fillRect(-9, 35, 7, 3);
    ctx.fillRect(2, 35, 7, 3);
    // Sneaker olive stripe
    ctx.fillStyle = PAL.shoesStripe;
    ctx.fillRect(-7, 36, 4, 1);
    ctx.fillRect(4, 36, 4, 1);
    // Soles
    ctx.fillStyle = PAL.shoesSole;
    ctx.fillRect(-9, 38, 7, 1);
    ctx.fillRect(2, 38, 7, 1);
  }

  function drawDetailedWalking(ctx, PAL, isBlinking, t) {
    const stride = Math.sin(t * 8);
    const oppositeStride = -stride;
    const bob = Math.round(Math.abs(stride) * -1);
    const torsoLean = Math.round(stride * 0.5);

    ctx.save();
    ctx.translate(torsoLean, 0);

    // Head and torso subtly follow the body's weight shift.
    drawHead(ctx, PAL, isBlinking, bob, 0);

    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-9, 3 + bob, 18, 14);
    ctx.fillStyle = PAL.shirtLight;
    ctx.fillRect(-8, 3 + bob, 16, 2);
    ctx.fillStyle = PAL.shirtShadow;
    ctx.fillRect(-9, 5 + bob, 1, 12);
    ctx.fillRect(8, 5 + bob, 1, 12);

    ctx.fillStyle = PAL.shirtStripe;
    ctx.fillRect(-9, 7 + bob, 18, 3);
    ctx.fillStyle = PAL.stripeShadow;
    ctx.fillRect(-9, 10 + bob, 18, 1);

    // Arms counter-swing against the legs, with a bent elbow and relaxed hands.
    const drawArm = (side, swing) => {
      const shoulderX = side * 9;
      const elbowX = shoulderX + side * Math.round(swing * 0.7);
      const handX = elbowX + side * Math.round(swing * 0.45);
      ctx.fillStyle = PAL.shirtBase;
      ctx.fillRect(shoulderX - 1 + (side < 0 ? -2 : 0), 3 + bob, 3, 6);
      ctx.fillRect(elbowX - 1, 8 + bob, 3, 5);
      ctx.fillStyle = PAL.skinBase;
      ctx.fillRect(handX - 1, 12 + bob, 3, 4);
    };

    drawArm(-1, oppositeStride * 3);
    drawArm(1, stride * 3);

    // Legs use separate upper and lower sections so the passing foot bends
    // instead of sliding as a single rigid block.
    const drawLeg = (legPhase, side) => {
      const footX = Math.round(legPhase * 4);
      const kneeX = Math.round(legPhase * 2);
      const lift = Math.round(Math.max(0, legPhase) * 2);
      const hipX = side < 0 ? -8 : 1;

      ctx.fillStyle = PAL.pantsBase;
      ctx.fillRect(hipX, 17 + bob, 7, 11);
      ctx.fillRect(hipX + kneeX, 27 + bob, 7, 8 - lift);
      ctx.fillStyle = PAL.pantsShadow;
      ctx.fillRect(hipX + kneeX, 32 + bob - lift, 7, 1);
      ctx.fillStyle = PAL.pantsLight;
      ctx.fillRect(hipX + kneeX + 1, 25 + bob, 3, 2);

      const shoeY = 35 + bob - lift;
      ctx.fillStyle = PAL.shoesBase;
      ctx.fillRect(hipX + footX - 1, shoeY, 8, 3);
      ctx.fillStyle = PAL.shoesStripe;
      ctx.fillRect(hipX + footX + 1, shoeY + 1, 4, 1);
      ctx.fillStyle = PAL.shoesSole;
      ctx.fillRect(hipX + footX - 1, shoeY + 3, 8, 1);
    };

    drawLeg(stride, -1);
    drawLeg(oppositeStride, 1);

    ctx.restore();
  }

  function drawDetailedSitting(ctx, PAL, isBlinking, t) {
    const headTilt = Math.round(Math.sin(t * 1.5) * 0.7);

    // Head
    drawHead(ctx, PAL, isBlinking, headTilt, 1);

    // Torso - Olive Shirt Lowered
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-9, 3, 18, 12);
    ctx.fillStyle = PAL.shirtLight;
    ctx.fillRect(-8, 3, 16, 2);
    ctx.fillStyle = PAL.shirtStripe;
    ctx.fillRect(-9, 6, 18, 3);

    // Arms resting on knees
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-12, 3, 4, 8);
    ctx.fillRect(8, 3, 4, 8);
    ctx.fillStyle = PAL.skinBase;
    ctx.fillRect(-11, 11, 4, 3);
    ctx.fillRect(7, 11, 4, 3);

    // Folded Pants (Cross-legged sitting)
    ctx.fillStyle = PAL.pantsBase;
    ctx.fillRect(-13, 14, 26, 6);
    ctx.fillStyle = PAL.pantsShadow;
    ctx.fillRect(-8, 17, 16, 2);

    // Sneakers tucked at sides
    ctx.fillStyle = PAL.shoesBase;
    ctx.fillRect(-15, 16, 4, 4);
    ctx.fillRect(11, 16, 4, 4);
    ctx.fillStyle = PAL.shoesSole;
    ctx.fillRect(-15, 19, 4, 1);
    ctx.fillRect(11, 19, 4, 1);
  }

  function drawDetailedPlaying(ctx, PAL, isBlinking, t) {
    const tap = Math.sin(t * 16) > 0 ? 1 : 0;
    const miniBallX = Math.round(Math.sin(t * 8) * 3);
    const screenGlow = Math.sin(t * 10) > 0 ? PAL.consoleScreenLight : PAL.consoleScreen;

    // Head looking down at console
    drawHead(ctx, PAL, isBlinking, 0, 1);

    // Torso - Olive Shirt
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-9, 3, 18, 14);
    ctx.fillStyle = PAL.shirtLight;
    ctx.fillRect(-8, 3, 16, 2);
    ctx.fillStyle = PAL.shirtStripe;
    ctx.fillRect(-9, 7, 18, 3);

    // Arms holding handheld forward
    ctx.fillStyle = PAL.shirtBase;
    ctx.fillRect(-12, 3, 4, 6);
    ctx.fillRect(8, 3, 4, 6);
    ctx.fillStyle = PAL.skinBase;
    ctx.fillRect(-10, 8, 4, 4);
    ctx.fillRect(6, 8, 4, 4);

    // DETAILED RETRO HANDHELD GAMING CONSOLE
    // Console Bezel & Body
    ctx.fillStyle = PAL.consoleBase;
    ctx.fillRect(-7, 8, 14, 10);
    ctx.fillStyle = PAL.shirtShadow;
    ctx.fillRect(-7, 17, 14, 1);

    // Glowing Animated Screen
    ctx.fillStyle = '#242922';
    ctx.fillRect(-5, 9, 10, 5);
    ctx.fillStyle = screenGlow;
    ctx.fillRect(-4, 10, 8, 3);

    // Mini game character / ball on the screen
    ctx.fillStyle = '#242922';
    ctx.fillRect(-1 + miniBallX, 11, 2, 1);

    // D-Pad
    ctx.fillStyle = '#242922';
    ctx.fillRect(-5, 15, 3, 1);
    ctx.fillRect(-4, 14, 1, 3);

    // Action Buttons (Tapping animation)
    ctx.fillStyle = tap === 1 ? '#DED8CD' : '#FFFFFF';
    ctx.fillRect(2, 15, 2, 1);
    ctx.fillRect(4, 14, 2, 1);

    // Pants
    ctx.fillStyle = PAL.pantsBase;
    ctx.fillRect(-8, 17, 16, 10);
    ctx.fillStyle = PAL.pantsShadow;
    ctx.fillRect(-1, 20, 2, 7);
    ctx.fillStyle = PAL.pantsLight;
    ctx.fillRect(-6, 21, 3, 2);
    ctx.fillRect(3, 21, 3, 2);

    // Sneakers
    ctx.fillStyle = PAL.shoesBase;
    ctx.fillRect(-9, 27, 7, 3);
    ctx.fillRect(2, 27, 7, 3);
    ctx.fillStyle = PAL.shoesStripe;
    ctx.fillRect(-7, 28, 4, 1);
    ctx.fillRect(4, 28, 4, 1);
    ctx.fillStyle = PAL.shoesSole;
    ctx.fillRect(-9, 29, 7, 1);
    ctx.fillRect(2, 29, 7, 1);
  }

  requestAnimationFrame(renderDoll);
}

// =========================================================================
// Navbar Controller (Scrollspy & Mobile Toggle)
// =========================================================================
function initNavbar() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navWrapper = document.querySelector('.nav-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Mobile menu toggle
  if (toggleBtn && navWrapper) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.classList.toggle('open');
      navWrapper.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleBtn.classList.remove('open');
        navWrapper.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navWrapper.contains(e.target)) {
        toggleBtn.classList.remove('open');
        navWrapper.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scrollspy: Highlight Active Nav Item on Scroll
  function updateScrollspy() {
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollspy, { passive: true });
  updateScrollspy(); // Run on initial load
}
