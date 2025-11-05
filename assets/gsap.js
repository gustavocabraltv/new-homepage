document.addEventListener('DOMContentLoaded', () => {
  // Corrige ao voltar pra aba
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Removido lenis.resize() - apenas refresh do ScrollTrigger
      ScrollTrigger.refresh(true);
    }
  });

  // LENIS COMPLETAMENTE REMOVIDO - Agora usando scroll nativo do navegador

  // Registra o plugin ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Detecta se estamos em mobile
  const isMobile = () => window.innerWidth <= 480;

  // Função auxiliar once()
  function once(el, event, fn, opts) {
    var onceFn = function (e) {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  // Função para detectar dispositivos touch
  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  // ======== ANIMAÇÃO SIMPLIFICADA HERO ========
// function initHeroAnimation() {
//   const video = document.querySelector('.video-scroll__player');
//   const heroImage = document.querySelector('.hero__image');
//   const heroLogo = document.querySelector('.hero__logo__reveal');

//   if (!video) {
//     console.error('Vídeo não encontrado para Hero Animation.');
//     return;
//   }

//   // Define src de acordo com device
//   const mobileVideoSrc = video.getAttribute('data-mobile-src');
//   const desktopVideoSrc = video.getAttribute('data-desktop-src');

//   if (mobileVideoSrc && desktopVideoSrc) {
//     video.src = isMobile() ? mobileVideoSrc : desktopVideoSrc;
//   }

//   // Configura vídeo
//   video.loop = true;
//   video.autoplay = true;
//   video.muted = true;
//   video.load();

//   // Quando o vídeo estiver pronto
//   video.addEventListener('loadeddata', () => {
//     // Fade in do vídeo
//     gsap.fromTo(
//       '.video-container',
//       { opacity: 0 },
//       { opacity: 1, duration: 1.5, ease: 'power2.out' }
//     );

//     // Logo sobe em 3s
//     gsap.to(heroLogo, {
//       y: '-50px',
//       opacity: 0,
//       duration: 3,
//       ease: 'power2.inOut',
//       delay: 0.5, // leve atraso pra dar tempo do vídeo aparecer
//     });

//     // Imagem desce em 3s
//     gsap.to(heroImage, {
//       y: '50px',
//       opacity: 0,
//       duration: 3,
//       ease: 'power2.inOut',
//       delay: 0.5,
//     });

//     // Titles em tempo certo do vídeo (ajusta delays conforme precisar)
//     gsap.fromTo(
//       '.hero__title--1',
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 4 }
//     );

//     gsap.fromTo(
//       '.hero__title--2',
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out', delay: 6 }
//     );
//   });
// }

function initHeroAnimation() {
  const video = document.querySelector('.video-scroll__player');
  const heroImage = document.querySelector('.hero__image');
  const heroLogo = document.querySelector('.hero__logo__reveal');
  
  if (!video) {
      console.error('Vídeo não encontrado para Hero Animation.');
      return;
  }

  // Inicializa os headings
  const title1 = document.querySelector("[data-hero-title='1']");
  const title2 = document.querySelector("[data-hero-title='2']");
  const title3 = document.querySelector("[data-hero-title='3']");
  const title4 = document.querySelector("[data-hero-title='4']");

  // Define src de acordo com device
  const mobileVideoSrc = video.getAttribute('data-mobile-src');
  const desktopVideoSrc = video.getAttribute('data-desktop-src');
  
  if (mobileVideoSrc && desktopVideoSrc) {
      video.src = isMobile() ? mobileVideoSrc : desktopVideoSrc;
  }

  // Configura vídeo
  video.loop = true;
  video.autoplay = true;
  video.muted = true;
  video.playbackRate = 9; // ← Controla velocidade: 1.5x mais rápido
  video.load();

  // Configuração inicial - vídeo invisível para fade-in suave
  gsap.set('.video-container', { opacity: 0 });
  gsap.set(video, { opacity: 0 });

  // Configuração inicial dos títulos
  gsap.set(title1, { opacity: 1, y: 0, display: 'block' });
  gsap.set([title2, title3, title4], { opacity: 0, y: 50, display: 'none' });

  // Variável para controlar qual título está ativo atualmente
  let currentActiveTitle = 1;
  let isTransitioning = false;

  // Função para sincronizar títulos com o tempo do vídeo
  function syncTitlesWithVideo() {
      if (!video.duration || isTransitioning) return;

      const currentTime = video.currentTime;
      const duration = video.duration;
      const progress = currentTime / duration;

      // Define os pontos de transição (em % do vídeo)
      const titleTransitions = {
          title1End: 0.25,    // 25% do vídeo
          title2End: 0.5,     // 50% do vídeo
          title3End: 0.75,    // 75% do vídeo
      };

      // Determina qual título deveria estar ativo
      let targetTitle = 1;
      if (progress >= titleTransitions.title3End) {
          targetTitle = 4;
      } else if (progress >= titleTransitions.title2End) {
          targetTitle = 3;
      } else if (progress >= titleTransitions.title1End) {
          targetTitle = 2;
      }

      // Se mudou de título, faz a transição
      if (targetTitle !== currentActiveTitle) {
          transitionToTitle(targetTitle);
      }
  }

  // Função para fazer transição suave entre títulos
  function transitionToTitle(newTitleNumber) {
      if (isTransitioning) return;
      
      isTransitioning = true;
      const currentTitle = getTitleElement(currentActiveTitle);
      const newTitle = getTitleElement(newTitleNumber);

      // Timeline para transição suave
      const transitionTl = gsap.timeline({
          onComplete: () => {
              currentActiveTitle = newTitleNumber;
              isTransitioning = false;
          }
      });

      // Fade out do título atual
      if (currentTitle) {
          transitionTl.to(currentTitle, {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: 'power2.in'
          }, 0);
      }

      // Fade in do novo título
      if (newTitle) {
          transitionTl
              .set(newTitle, { 
                  display: 'block', 
                  y: 20, 
                  opacity: 0 
              }, 0.2)
              .to(newTitle, {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: 'power2.out'
              }, 0.3);
      }

      // Esconde o título anterior após a transição
      if (currentTitle) {
          transitionTl.set(currentTitle, { 
              display: 'none' 
          }, 0.8);
      }
  }

  // Função auxiliar para pegar o elemento do título
  function getTitleElement(titleNumber) {
      switch(titleNumber) {
          case 1: return title1;
          case 2: return title2;
          case 3: return title3;
          case 4: return title4;
          default: return null;
      }
  }

  // Quando o vídeo estiver pronto
  video.addEventListener('loadeddata', () => {
      console.log('Vídeo carregado, duração:', video.duration);

      // Fade in suave do vídeo - container e elemento (4 segundos)
      gsap.to('.video-container', {
          opacity: 1,
          duration: 4,  // ← Aqui controla: 4 segundos
          ease: 'power2.out'
      });

      gsap.to(video, {
          opacity: 1,
          duration: 4,  // ← Aqui também: 4 segundos
          ease: 'power2.out'
      });

      // Logo sobe em 2s (sua animação personalizada)
      gsap.to(heroLogo, {
          y: '-550px',
          opacity: 0,
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.5,
      });

      // Imagem desce em 2s (sua animação personalizada)
      gsap.to(heroImage, {
          y: '550px',
          opacity: 0,
          duration: 2,
          ease: 'power2.inOut',
          delay: 0.5,
      });

      // Aguarda um pouco antes de iniciar o vídeo para dar tempo do fade-in
      setTimeout(() => {
          video.play();
      }, 500);
  });

  // Event listeners para sincronizar títulos com o vídeo
  video.addEventListener('timeupdate', syncTitlesWithVideo);
  video.addEventListener('seeked', syncTitlesWithVideo);

  // Para casos onde o vídeo já está carregado
  if (video.readyState >= 2) {
      video.dispatchEvent(new Event('loadeddata'));
  }
}


  // ======== ANIMAÇÃO FOOTWEAR ========
  function initFootwearAnimation() {
    // Seleciona os elementos
    const footwearHeading = document.querySelector('.footwear__heading');
    const footwear = document.querySelector('.footwear__inner');
    const title1 = document.querySelector('[data-description="1"] .feature-description__title');
    const title2 = document.querySelector('[data-description="2"] .feature-description__title');
    const title3 = document.querySelector('[data-description="3"] .feature-description__title');
    const line1 = document.querySelector('[data-description="1"] .feature-description__line');
    const line2 = document.querySelector('[data-description="2"] .feature-description__line');
    const line3 = document.querySelector('[data-description="3"] .feature-description__line');
    const textNames = document.querySelector('.text-names');

    if (!footwear) return;

    // Animação dos nomes
    const names = document.querySelectorAll(`.text-names h2`);
    if (names.length) {
      // Configura a timeline para nomes - loop infinito
      const namesTimeline = gsap.timeline({ repeat: -1 });

      // Esconde todos os nomes inicialmente
      gsap.set(names, { opacity: 0 });

      // Adiciona cada nome à timeline
      names.forEach((name) => {
        namesTimeline
          .to(name, { opacity: 1, duration: 0.3 }) // Mostra
          .to({}, { duration: 0.7 }) // Pausa
          .to(name, { opacity: 0, duration: 0.3 }); // Esconde
      });
    }

    // Implementação responsiva com matchMedia
    const mm = gsap.matchMedia();

    // Desktop (telas maiores que 768px)
    mm.add('(min-width: 769px)', () => {
      // Heading Animation
      if (footwearHeading) {
        footwearHeading.setAttribute('animate', '');

        // Inicializa o SplitType no heading
        let typeSplit = new SplitType(footwearHeading, {
          types: 'lines, words, chars',
          tagName: 'span',
        });

        gsap.from(`${footwearHeading.tagName.toLowerCase()}[animate] .line`, {
          y: '100%',
          opacity: 0,
          duration: 0.5,
          ease: 'Second.in',
          stagger: 0.03,
          scrollTrigger: {
            // markers: true,
            trigger: footwearHeading,
            start: 'top+=300 bottom',
            toggleActions: 'play reverse play reverse',
          },
        });
      }

      // ScrollTrigger config
      const scrollTriggerConfig = {
        trigger: '.footwear__inner',
        start: 'top+=500 bottom',
        end: '+=500',
        scrub: 2,
      };

      // Cria a timeline dentro do contexto do matchMedia
      const tlFootwear = gsap.timeline({
        scrollTrigger: scrollTriggerConfig,
      });

      // Linha 1 (direita para esquerda)
      if (line1) {
        tlFootwear
          .fromTo(
            line1,
            { width: '0%', marginLeft: '100%' },
            { width: '100%', marginLeft: '0%', duration: 2, ease: 'power1.inOut' }
          )
          .fromTo([title1, line1], { opacity: 0 }, { opacity: 1 }, '<')
          .to(
            textNames,
            {
              opacity: 1,
              delay: 0.5,
              duration: 1,
            },
            '<'
          );
      }

      // Linha 2 (esquerda para direita)
      if (line2) {
        tlFootwear
          .fromTo(line2, { width: '0%' }, { width: '100%', duration: 2, ease: 'power1.inOut' })
          .fromTo([title2, line2], { opacity: 0 }, { opacity: 1 }, '<');
      }

      // Linha 3 (direita para esquerda)
      if (line3) {
        tlFootwear
          .fromTo(
            line3,
            { width: '0%', marginLeft: '100%' },
            { width: '100%', marginLeft: '0%', duration: 3, ease: 'power1.inOut' }
          )
          .fromTo([title3, line3], { opacity: 0 }, { opacity: 1 }, '<');
      }

      return () => {
        // Cleanup function
        if (tlFootwear.scrollTrigger) {
          tlFootwear.scrollTrigger.kill();
        }
      };
    });

    // Mobile (telas menores que 768px)
    mm.add('(max-width: 768px)', () => {
      const footwearSection = document.querySelector('.footwear');
      const layer = document.querySelector('.layer');

      // First, we'll prepare the elements with initial values
      gsap.set([title1, title2, title3], { opacity: 0, y: 0, visibility: 'hidden' });
      gsap.set([line1, line2, line3], { width: '0%', opacity: 0, visibility: 'hidden' });
      gsap.set(textNames, { opacity: 0, visibility: 'hidden' });

      // PIN the section first
      // const footwearPin = ScrollTrigger.create({
      //   trigger: footwearSection,
      //   start: 'top top',
      //   end: '+=2200', // Amount of scroll distance while pinned
      //   pin: true,
      //   pinSpacing: true,
      //   id: 'footwear-pin-mobile',
      // });

      // Create timeline for animations while pinned
      const tlFootwear = gsap.timeline({
        scrollTrigger: {
          trigger: footwearSection,
          start: 'top center', // Start at the same point as the pin
          end: 'bottom bottom', // Same as pin end
          scrub: 2,
          id: 'footwear-animation-mobile',
        },
      });

      // First line/title (first third of scroll)
      if (line1) {
        tlFootwear
          // Set visibility first
          .set([title1, line1], { visibility: 'visible' }, 0)
          // Animate first title and line
          .fromTo(title1, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0)
          .fromTo(
            line1,
            { width: '0%', marginLeft: '100%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0
          )
          .fromTo(
            textNames,
            { opacity: 0, visibility: 'hidden' },
            { opacity: 1, duration: 0.3, visibility: 'visible' },
            '<'
          )
          .fromTo(footwearHeading, { zIndex: 1 }, { zIndex: 2 }, '<');
      }

      // Second line/title (second third of scroll)
      if (line2) {
        tlFootwear
          .set([title2, line2], { visibility: 'visible' }, 0.33)
          .fromTo(title2, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0.33)
          .fromTo(
            line2,
            { width: '0%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0.33
          );
      }

      // Third line/title (last third of scroll)
      if (line3) {
        tlFootwear
          .set([title3, line3], { visibility: 'visible' }, 0.66)
          .fromTo(title3, { opacity: 0, y: -25 }, { opacity: 1, y: 0, duration: 0.2 }, 0.66)
          .fromTo(
            line3,
            { width: '0%', marginLeft: '100%', opacity: 1 },
            { width: '90%', marginLeft: '5%', opacity: 1, duration: 0.2 },
            0.66
          )
          .to(layer, { opacity: 0.4, duration: 0.5 }, '<'); // Fade in the layer
      }

      // Configure the names animation
      const names = document.querySelectorAll(`.text-names h2`);
      if (names.length) {
        // Timeline for names - infinite loop
        const namesTimeline = gsap.timeline({ repeat: -1 });

        // Hide all names initially
        gsap.set(names, { opacity: 0 });

        // Add each name to the timeline
        names.forEach((name) => {
          namesTimeline
            .to(name, { opacity: 1, duration: 0.3 })
            .to({}, { duration: 0.7 })
            .to(name, { opacity: 0, duration: 0.3 });
        });
      }

      return () => {
        // Cleanup function
        if (footwearPin) footwearPin.kill();
        if (tlFootwear.scrollTrigger) tlFootwear.scrollTrigger.kill();
      };
    });
  }

  // ======== ANIMAÇÃO INSOLE SOLO ========
  function initInsoleSoloAnimation() {
    const insole = document.querySelector('.insole-solo');
    const footwear = document.querySelector('.footwear');

    if (!insole || !footwear) return;

    // Configuração inicial comum
    gsap.set(insole, {
      opacity: 0,
      visibility: 'visible', // Garante que o elemento esteja visível, apenas com opacity 0
    });

    // Criar um objeto MediaQueryList para detecção de dispositivos
    const mediaMatch = gsap.matchMedia();

    // Desktop (acima de 768px)
    mediaMatch.add('(min-width: 769px)', () => {
      // Definindo o estado inicial para desktop
      gsap.set(insole, {
        width: '100px',
      });

      // Criando uma timeline pausada para desktop
      const tlDesktop = gsap.timeline({
        paused: true,
      });

      // Animação desktop
      tlDesktop.fromTo(
        insole,
        { width: '140px', y: 188 }, // valores iniciais (from)
        { width: '310px', ease: 'none', y: 0 }, // valores finais (to)
        0 // posição na timeline
      );

      // ScrollTrigger para desktop
      const insoleTrigger = ScrollTrigger.create({
        trigger: footwear,
        start: 'top-=150 bottom',
        end: 'bottom-=300 bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          // Atualiza a timeline baseado no progresso do scroll
          tlDesktop.progress(self.progress);

          // Controle separado e abrupto para opacity
          if (self.progress > 0.1) {
            if (insole.style.opacity !== '1') {
              gsap.set(insole, { opacity: 1 });
            }
          } else {
            if (insole.style.opacity !== '0') {
              gsap.set(insole, { opacity: 0 });
            }
          }

          // Log para debug
          console.log(
            'Desktop - Progresso: ' +
              self.progress.toFixed(2) +
              ' | Width: ' +
              getComputedStyle(insole).width +
              ' | Opacity: ' +
              getComputedStyle(insole).opacity
          );
        },
      });

      return () => {
        // Função de limpeza
        if (insoleTrigger) insoleTrigger.kill();
      };
    });

    // Mobile (até 768px)
    mediaMatch.add('(max-width: 768px)', () => {
      // Definindo o estado inicial para mobile
      gsap.set(insole, {
        width: '134px', // Valor inicial menor para mobile
        transformOrigin: 'center center',
      });

      // Criando uma timeline pausada para mobile
      const tlMobile = gsap.timeline({
        paused: true,
      });

      // Animação mobile (valores menores e posicionamento ajustado)
      tlMobile.fromTo(
        insole,
        { width: '132px', y: -29 }, // valores iniciais reduzidos para mobile
        { width: '240px', y: 0 }, // valores finais reduzidos para mobile
        0 // posição na timeline
      );

      // ScrollTrigger para mobile com pontos de ativação ajustados
      const insoleMobileTrigger = ScrollTrigger.create({
        trigger: footwear,
        start: 'top-=280 bottom', // Ajustado para mobile
        end: 'bottom-=200 bottom', // Ajustado para mobile
        onUpdate: (self) => {
          // Atualiza a timeline baseado no progresso do scroll
          tlMobile.progress(self.progress);

          // Controle separado e abrupto para opacity
          if (self.progress > 0.1) {
            if (insole.style.opacity !== '1') {
              gsap.set(insole, { opacity: 1 });
            }
          } else {
            if (insole.style.opacity !== '0') {
              gsap.set(insole, { opacity: 0 });
            }
          }

          // Log para debug
          // console.log(
          //   'Mobile - Progresso: ' +
          //     self.progress.toFixed(2) +
          //     ' | Width: ' +
          //     getComputedStyle(insole).width +
          //     ' | Opacity: ' +
          //     getComputedStyle(insole).opacity
          // );
        },
      });

      return () => {
        // Função de limpeza
        if (insoleMobileTrigger) insoleMobileTrigger.kill();
      };
    });

    // Animação dos nomes na palmilha
    const names = document.querySelectorAll('.text-names h2');
    if (names.length) {
      // Configura a timeline para nomes - loop infinito
      const namesTimeline = gsap.timeline({ repeat: -1 });

      // Esconde todos os nomes inicialmente
      gsap.set(names, { opacity: 0 });

      // Adiciona cada nome à timeline
      names.forEach((name) => {
        namesTimeline
          .to(name, { opacity: 1, duration: 0.3 }) // Mostra
          .to({}, { duration: 0.7 }) // Pausa
          .to(name, { opacity: 0, duration: 0.3 }); // Esconde
      });
    }
  }

  // ======== ANIMAÇÃO DOS CARDS (FUNÇÃO VAZIA - SUBSTITUA PELA SUA IMPLEMENTAÇÃO) ========
  function initCardAnimation() {
    // Esta função estava comentada no código original
    // Adicione aqui sua implementação de animação dos cards se necessário
    console.log('Animação dos cards - implementação necessária');
  }

  // ======== ANIMAÇÃO DO WIREFRAME ========
  function initWireframeAnimation() {
    // console.log('Iniciando animação do wireframe');
    const wireframe = document.querySelector('.wireframe');
    const overlay = document.querySelector('.wireframe__content-right--after');

    if (!wireframe || !overlay) {
      console.error('Elementos wireframe não encontrados para animação.');
      return;
    }

    // Uso de matchMedia para tratamento responsivo
    const mm = gsap.matchMedia();

    // Desktop animation
    mm.add('(min-width: 481px)', () => {
      // Pin do wireframe
      const wireframePin = ScrollTrigger.create({
        trigger: wireframe,
        start: 'top top',
        end: '+=1500', // Distância de scroll durante o pin
        pin: true,
        pinSpacing: true,
        scrub: 2,
      });

      // Animação do clip-path
      const wireframeAnimation = gsap.fromTo(
        overlay,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: wireframe,
            start: 'top top',
            end: '+=1500',
            scrub: 2,
          },
        }
      );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (wireframePin) wireframePin.kill();
        if (wireframeAnimation.scrollTrigger) wireframeAnimation.scrollTrigger.kill();
      };
    });

    // Mobile animation (sem pin para melhor experiência)
    mm.add('(max-width: 480px)', () => {
      // Animação baseada em scroll para mobile
      const wireframeMobileAnimation = gsap.fromTo(
        overlay,
        { clipPath: 'inset(57% 0 0 0)' }, // Valor inicial para mobile
        {
          clipPath: 'inset(-8% 0 0 0)', // Valor final para mobile
          duration: 1,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: wireframe,
            start: 'top center', // Inicia quando o topo do elemento atinge o centro da viewport
            end: 'bottom bottom-=100', // Termina quando o final do elemento atinge o final da viewport
            scrub: 1, // Efeito mais suave
            // Sem pin no mobile para melhor experiência
          },
        }
      );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (wireframeMobileAnimation.scrollTrigger) wireframeMobileAnimation.scrollTrigger.kill();
      };
    });
  }

  // ======= ANIMAÇÃO DO TABS NO MOBILE  ========
  // function initTabsAnimationMobile() {
  //   // console.log('Inicializando animação de tabs para mobile');

  //   // Verificar se a seção de tabs existe
  //   const tabsSection = document.querySelector('.tabs');
  //   if (!tabsSection) {
  //     console.error('Seção tabs não encontrada');
  //     return;
  //   }

  //   // Referências aos elementos
  //   const tabs = document.querySelectorAll('.tabs__step');
  //   const tabsImage = document.querySelector('.tabs__image');

  //   // Usar matchMedia para aplicar diferentes comportamentos baseados no tamanho da tela
  //   const mm = gsap.matchMedia();

  //   // Configuração para Mobile (telas menores que 769px)
  //   mm.add('(max-width: 768px)', () => {
  //     // console.log('Configurando tabs com ScrollTrigger para mobile');

  //     // Garantir que o primeiro tab esteja ativo imediatamente
  //     if (window.tabsSlider) {
  //       // Forçar a seleção do primeiro tab antes de qualquer animação
  //       window.tabsSlider.switchTab(0);

  //       // Desabilitar o autoplay para mobile
  //       window.tabsSlider.stopAutoplay();
  //       window.tabsSlider.hasCompletedSequence = true; // Impede que o autoplay seja iniciado novamente
  //     }

  //     // Desabilitar os cliques nas tabs no mobile
  //     tabs.forEach((tab) => {
  //       tab.style.pointerEvents = 'none';
  //     });

  //     // Pin da seção tabs para mobile - DOBRADO O TEMPO DE SCROLL
  //     const tabsPin = ScrollTrigger.create({
  //       trigger: tabsSection,
  //       start: 'top top',
  //       end: '+=600', // Valor dobrado (era 300)
  //       pin: true,
  //       pinSpacing: true,
  //       id: 'tabs-pin-mobile',
  //     });

  //     // Timeline para controlar as transições entre as tabs - DOBRADO O TEMPO DE SCROLL
  //     const tabsTimeline = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: tabsSection,
  //         start: 'top top',
  //         end: '+=600', // Valor dobrado (era 300)
  //         scrub: 1,
  //         id: 'tabs-animation-mobile',
  //         onUpdate: function (self) {
  //           // Determinar qual tab deve estar ativo com base no progresso do scroll
  //           const progress = self.progress;

  //           if (progress < 0.33) {
  //             // Primeiro terço do scroll - tab 1
  //             if (window.tabsSlider && window.tabsSlider.currentTab !== 0) {
  //               window.tabsSlider.switchTab(0);
  //             }
  //           } else if (progress < 0.66) {
  //             // Segundo terço do scroll - tab 2
  //             if (window.tabsSlider && window.tabsSlider.currentTab !== 1) {
  //               window.tabsSlider.switchTab(1);
  //             }
  //           } else {
  //             // Último terço do scroll - tab 3
  //             if (window.tabsSlider && window.tabsSlider.currentTab !== 2) {
  //               window.tabsSlider.switchTab(2);
  //             }
  //           }
  //         },
  //       },
  //     });

  //     return () => {
  //       // Função de limpeza quando o matchMedia não se aplica mais
  //       if (tabsPin) tabsPin.kill();
  //       if (tabsTimeline.scrollTrigger) tabsTimeline.scrollTrigger.kill();

  //       // Restaurar os eventos de clique
  //       tabs.forEach((tab) => {
  //         tab.style.pointerEvents = 'auto';
  //       });
  //     };
  //   });

  //   // Configuração para Desktop (telas maiores que 768px)
  //   mm.add('(min-width: 769px)', () => {
  //     console.log('Configurando tabs para desktop - mantendo comportamento padrão');

  //     // Não fazemos nada no desktop, pois queremos manter o comportamento original
  //     // O TabsSlider já gerencia a lógica de autoplay e clique no desktop

  //     return () => {
  //       // Função de limpeza, nenhuma necessária pois não criamos nada especial para desktop
  //     };
  //   });
  // }

  // ======== ANIMAÇÃO DO FOOTER ========
  function initFooterAnimation() {
    // console.log('Iniciando animação do footer');
    const footer = document.querySelector('.footer');
    const banner = document.querySelector('.footer__banner');
    const bottom = document.querySelector('.footer__bottom');

    if (!footer || !banner || !bottom) {
      console.error('Elementos do footer não encontrados para animação.');
      return;
    }

    // Definir a altura da seção antes do pin para evitar recálculos
    const footerHeight = footer.offsetHeight;
    gsap.set(footer, { height: footerHeight });

    // Animações responsivas usando matchMedia
    const mm = gsap.matchMedia();

    // Desktop animações
    mm.add('(min-width: 481px)', () => {
      // Pin e animação em uma única configuração
      const footerDesktop = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top top',
          end: '+=1000',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          fastScrollEnd: false,
          preventOverlaps: true,
          id: 'footer-desktop-pin',
        },
      });

      footerDesktop
        .to(banner, {
          width: '100%',
          height: 600,
          borderRadius: 24,
          ease: 'power2.inOut',
        })
        .to('.footer__banner-overlay', { opacity: 0.5 }, '<')
        .fromTo(
          '.footer__title',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<+=0.2'
        )
        .fromTo(
          '.appstore-btn',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<'
        );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (footerDesktop.scrollTrigger) footerDesktop.scrollTrigger.kill();
      };
    });

    // Mobile animações
    mm.add('(max-width: 480px)', () => {
      // Pin e animação em uma única configuração
      const footerMobile = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top top',
          end: '+=1000',
          scrub: 2,
          pin: true,
          pinSpacing: true,
          fastScrollEnd: false,
          preventOverlaps: true,
          id: 'footer-mobile-pin',
        },
      });

      footerMobile
        .to(banner, {
          width: '100%',
          height: 760, // Altura maior para mobile
          borderRadius: 0, // Sem bordas arredondadas no mobile
          ease: 'power2.inOut',
        })
        .to('.footer__banner-overlay', { opacity: 0.5 }, '<')
        .fromTo(
          '.footer__title',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<+=0.2'
        )
        .fromTo(
          '.appstore-btn',
          { opacity: 0, visibility: 'hidden' },
          { opacity: 1, visibility: 'visible', ease: 'power2.inOut' },
          '<'
        );

      return () => {
        // Limpeza quando o matchMedia não se aplica mais
        if (footerMobile.scrollTrigger) footerMobile.scrollTrigger.kill();
      };
    });
  }

  // Inicialização das animações
  function initAnimations() {
    // console.log('Inicializando animações');

    // Inicializa as animações em sequência
    // initHeroAnimation();
    // Pequeno delay para garantir que a hero animation está completa
    setTimeout(() => {
      initFootwearAnimation();
      initInsoleSoloAnimation();
      initCardAnimation();
      initWireframeAnimation();
      initTabsAnimationMobile();
      initFooterAnimation();
    }, 200);
  }

  // Configuração de event listeners
  function setupEventListeners() {
    // Responsividade
    window.addEventListener('resize', () => {
      // Força atualização do ScrollTrigger após redimensionamento
      ScrollTrigger.refresh();
      console.log('ScrollTriggers atualizados após redimensionamento');
    });

    // Detecta carregamento completo da página
    window.addEventListener('load', () => {
      console.log('Página totalmente carregada');

      // Refresh todos os ScrollTriggers
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });

    // Monitora eventos de ScrollTrigger (opcional para debug)
    // ScrollTrigger.addEventListener('refreshInit', () => console.log('ScrollTrigger: iniciando refresh'));
    // ScrollTrigger.addEventListener('refresh', () => console.log('ScrollTrigger: refresh concluído'));
  }

  // Inicializa
  setupEventListeners();
  initAnimations();
});

// Event listener adicional para visibilitychange (fora do DOMContentLoaded)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // Removido lenis.resize() - apenas refresh do ScrollTrigger
    ScrollTrigger.refresh(true);
  }
});