// tabs.js
class TabsSlider {
  constructor() {
    this.tabs = Array.from(document.querySelectorAll('.tabs__step'));
    this.image = document.querySelector('.tabs__image');
    if (!this.tabs.length || !this.image) return;

    // Garante foco por teclado nos steps
    this.tabs.forEach((tab) => {
      tab.setAttribute('tabindex', '0');
      tab.setAttribute('role', 'button');
      tab.setAttribute('aria-pressed', tab.classList.contains('active') ? 'true' : 'false');
    });

    // Bind eventos (clique e teclado)
    this.bindEvents();

    // Se não houver .active no HTML, define a primeira
    const initialIndex = Math.max(
      0,
      this.tabs.findIndex((t) => t.classList.contains('active'))
    );
    this.switchTab(initialIndex === -1 ? 0 : initialIndex);
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.switchTab(index));
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.switchTab(index);
        }
      });
    });
  }

  switchTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Atualiza classes e aria
    this.tabs.forEach((t, i) => {
      const isActive = i === index;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Troca imagem usando o mesmo path atual
    const imageFile = this.tabs[index].dataset.image; // ex: 'slide-2.png'
    if (imageFile) {
      try {
        const url = new URL(this.image.src);
        url.pathname = url.pathname.replace(/[^/]+$/, imageFile);
        this.image.src = url.toString();
      } catch (_) {
        // Fallback se URL falhar (ambientes sem URL absoluta)
        const base = this.image.src.split('/').slice(0, -1).join('/');
        this.image.src = `${base}/${imageFile}`;
      }
    }
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new TabsSlider();
});
