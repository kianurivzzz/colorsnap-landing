class LandingApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupNavbarEffects();
    this.setupDemoAnimation();
    this.setupDemoColorPicker();
    this.setupIntersectionObserver();
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            navHeight -
            20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  setupNavbarEffects() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        nav.style.boxShadow = 'none';
      }

      lastScrollY = currentScrollY;
    });
  }

  setupDemoAnimation() {
    const demoCard = document.querySelector('.demo-card');
    const demoBtn = document.querySelector('.demo-btn');
    const demoColors = document.querySelectorAll('.demo-color');

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        demoBtn.style.transform = 'scale(0.95)';
        demoBtn.style.background =
          'linear-gradient(135deg, #FF8A50 0%, #FF6B35 100%)';

        setTimeout(() => {
          demoBtn.style.transform = 'scale(1)';
          demoBtn.style.background = 'var(--accent-gradient)';

          demoColors.forEach((color, index) => {
            setTimeout(() => {
              color.style.transform = 'translateX(0)';
              color.style.opacity = '1';
            }, index * 150);
          });
        }, 150);
      });

      setTimeout(() => {
        demoColors.forEach((color, index) => {
          color.style.transform = 'translateX(-20px)';
          color.style.opacity = '0';
          color.style.transition = 'all 0.3s ease';

          setTimeout(() => {
            color.style.transform = 'translateX(0)';
            color.style.opacity = '1';
          }, 1000 + index * 200);
        });
      }, 500);
    }
  }

  setupDemoColorPicker() {
    const demoBtn = document.getElementById('demoPickerBtn');
    const demoBtnCard = document.getElementById('demoBtnCard');
    let isPickerActive = false;
    let instruction = null;

    const startPicker = triggerBtn => {
      if (isPickerActive) {
        this.exitPickerMode();
        return;
      }

      isPickerActive = true;
      if (triggerBtn) {
        triggerBtn.style.background = 'var(--accent-gradient)';
        triggerBtn.style.color = 'white';
      }

      document.body.style.cursor = 'crosshair';

      instruction = document.createElement('div');
      instruction.className = 'demo-instruction';
      instruction.innerHTML = `
        <div class="demo-instruction__content">
          🎯 <span data-i18n="demo_instruction">Кликни на любой элемент страницы чтобы "поймать" его цвет!</span>
          <button class="demo-instruction__close">✕</button>
        </div>
      `;

      instruction.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--background);
        color: white;
        padding: 16px 24px;
        border-radius: var(--border-radius);
        font-size: 14px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: var(--card-shadow-hover);
        animation: slideDown 0.3s ease;
      `;

      document.body.appendChild(instruction);

      window.landingI18n.updatePageTexts();

      const closeBtn = instruction.querySelector('.demo-instruction__close');
      closeBtn.addEventListener('click', () => {
        this.exitPickerMode();
      });

      const clickHandler = async e => {
        if (
          e.target.closest('.demo-instruction') ||
          e.target === demoBtn ||
          e.target === demoBtnCard
        ) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();

        const colorInfo = await this.captureColorAtPoint(e.clientX, e.clientY);

        if (colorInfo) {
          this.showColorResult(colorInfo.color, e.target, colorInfo.source);
        } else {
          this.showColorResult('#2196F3', e.target, 'fallback');
        }

        this.exitPickerMode();
      };

      document.addEventListener('click', clickHandler, true);

      const escHandler = e => {
        if (e.key === 'Escape') {
          this.exitPickerMode();
        }
      };

      document.addEventListener('keydown', escHandler);

      this.demoPickerHandlers = {
        click: clickHandler,
        keydown: escHandler,
        triggerBtn: triggerBtn,
        exitPickerMode: () => {
          isPickerActive = false;
          document.body.style.cursor = '';
          if (triggerBtn) {
            triggerBtn.style.background = '';
            triggerBtn.style.color = '';
          }

          if (instruction && instruction.parentNode) {
            instruction.remove();
          }

          document.removeEventListener('click', clickHandler, true);
          document.removeEventListener('keydown', escHandler);
        },
      };
    };

    if (demoBtn) {
      demoBtn.addEventListener('click', () => startPicker(demoBtn));
    }

    if (demoBtnCard) {
      demoBtnCard.addEventListener('click', () => startPicker(demoBtnCard));
    }
  }

  exitPickerMode() {
    if (this.demoPickerHandlers) {
      this.demoPickerHandlers.exitPickerMode();
    }
  }

  async captureColorAtPoint(x, y) {
    try {
      if ('EyeDropper' in window) {
        console.log('Используем EyeDropper API');
        const eyeDropper = new EyeDropper();
        const result = await eyeDropper.open();

        if (result && result.sRGBHex) {
          return {
            color: result.sRGBHex,
            source: 'EyeDropper API',
          };
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('EyeDropper отменен пользователем');
        return null;
      }
      console.log('EyeDropper не сработал, используем fallback:', error);
    }

    return this.getColorAtPointFallback(x, y);
  }

  getColorAtPointFallback(x, y) {
    const currentLang = window.landingI18n.getCurrentLanguage();

    try {
      const element = document.elementFromPoint(x, y);
      if (!element) return null;

      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;

      let targetColor = backgroundColor;
      let source = currentLang === 'ru' ? 'фон' : 'background';

      if (
        backgroundColor === 'rgba(0, 0, 0, 0)' ||
        backgroundColor === 'transparent'
      ) {
        targetColor = color;
        source = currentLang === 'ru' ? 'текст' : 'text';
      }

      const hexColor = this.rgbToHex(targetColor);

      if (hexColor) {
        return {
          color: hexColor,
          source: source,
        };
      }

      return null;
    } catch (error) {
      console.error('Ошибка fallback метода:', error);
      return null;
    }
  }

  rgbToHex(rgbString) {
    if (!rgbString || rgbString === 'transparent') {
      return null;
    }

    if (rgbString.startsWith('#')) {
      return rgbString.toUpperCase();
    }

    const rgbMatch = rgbString.match(
      /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)/
    );

    if (!rgbMatch) {
      return null;
    }

    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);

    const hex =
      '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex.toUpperCase();
  }

  showColorResult(colorValue, element, source = 'background') {
    let hexColor = this.rgbToHex(colorValue) || colorValue;

    const result = document.createElement('div');
    result.className = 'demo-color-result';
    const currentLang = window.landingI18n.getCurrentLanguage();
    const successText =
      currentLang === 'ru' ? '🎉 Цвет получен!' : '🎉 Color Captured!';
    const copyText = currentLang === 'ru' ? 'Скопировать' : 'Copy';

    result.innerHTML = `
      <div class="demo-color-result__content">
        <div class="demo-color-result__swatch" style="background: ${hexColor}"></div>
        <div class="demo-color-result__info">
          <div class="demo-color-result__title">${successText}</div>
          <div class="demo-color-result__value">${hexColor}</div>
          <div class="demo-color-result__element">${element.tagName.toLowerCase()} • ${source}</div>
        </div>
        <button class="demo-color-result__copy" onclick="navigator.clipboard?.writeText('${hexColor}')">
          ${copyText}
        </button>
      </div>
    `;

    result.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 24px;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--card-shadow-hover);
      z-index: 10001;
      animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;

    document.body.appendChild(result);

    setTimeout(() => {
      if (result.parentNode) {
        result.style.animation = 'popOut 0.3s ease';
        setTimeout(() => result.remove(), 300);
      }
    }, 4000);
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document
      .querySelectorAll('.feature-card, .step, .hero__content, .hero__demo')
      .forEach(el => {
        observer.observe(el);
      });
  }

  copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
      } catch (error) {
        console.error('Не удалось скопировать:', error);
      } finally {
        textArea.remove();
      }
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'landing-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: var(--accent-gradient);
      color: white;
      padding: 16px 24px;
      border-radius: var(--border-radius);
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LandingApp();
});

const additionalStyles = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .feature-card,
  .step,
  .hero__content,
  .hero__demo {
    animation-play-state: paused;
  }

  .visible {
    animation-play-state: running !important;
  }

  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes popIn {
    from {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes popOut {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
  }

  .demo-instruction__content {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .demo-instruction__close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s ease;
  }

  .demo-instruction__close:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .demo-color-result__content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .demo-color-result__swatch {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius);
    border: 3px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .demo-color-result__title {
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }

  .demo-color-result__value {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-weight: 600;
    color: var(--primary-blue);
    font-size: 16px;
  }

  .demo-color-result__element {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .demo-color-result__copy {
    background: var(--accent-gradient);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: var(--border-radius-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 12px;
  }

  .demo-color-result__copy:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
