(() => {
  'use strict';
  // All purchase links use the checkout supplied by the product owner.
  const CHECKOUT_URL = 'https://pay.kiwify.com.br/Q1tCx3e';
  document.querySelectorAll('[data-checkout]').forEach(link => { link.href = CHECKOUT_URL; });

  // Calendar-day urgency expires automatically; it is never a resetting timer.
  const saoPauloDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());
  const daysUntilExam = Math.round((Date.parse('2026-11-08T00:00:00Z') - Date.parse(saoPauloDate + 'T00:00:00Z')) / 86400000);
  document.querySelectorAll('[data-urgency]').forEach(label => {
    label.textContent = daysUntilExam > 0 && daysUntilExam < 20 ? 'FALTAM MENOS DE 20 DIAS PARA O ENEM' : 'REVISÃO ENEM / DO CONCEITO À PRÁTICA';
  });
  document.getElementById('current-year').textContent = String(new Date().getFullYear());

  const dialog = document.getElementById('preview-dialog');
  const image = document.getElementById('preview-image');
  const title = document.getElementById('preview-title');
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      const thumbnail = button.querySelector('img');
      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = button.dataset.title;
      title.textContent = button.dataset.title;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      dialog.querySelector('.dialog-image-wrap').scrollTop = 0;
    });
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

  // Each flashcard keeps its own state and only toggles its own faces.
  document.querySelectorAll('[data-flashcard]').forEach(card => {
    const button = card.querySelector('[data-flip]');
    const question = card.querySelector('[data-flashcard-question]');
    const answer = card.querySelector('[data-flashcard-answer]');
    const label = button.querySelector('.flip-label');
    button.addEventListener('click', () => {
      const showAnswer = button.getAttribute('aria-expanded') !== 'true';
      question.hidden = showAnswer;
      answer.hidden = !showAnswer;
      button.setAttribute('aria-expanded', String(showAnswer));
      button.setAttribute('aria-label', showAnswer ? 'Voltar à pergunta do flashcard' : 'Virar o flashcard para ver a resposta');
      label.textContent = showAnswer ? 'Voltar' : 'Virar';
      card.classList.toggle('is-flipped', showAnswer);
    });
  });

  // Hide the mobile bar only while an in-page purchase button is fully usable.
  const bar = document.querySelector('.mobile-buy');
  const purchaseButtons = Array.from(document.querySelectorAll('.hero-buy, .offer-buy'));
  const header = document.querySelector('.header');
  let updateQueued = false;
  const updateBar = () => {
    updateQueued = false;
    const topEdge = Math.max(0, header.getBoundingClientRect().bottom) + 10;
    const bottomEdge = window.innerHeight - bar.offsetHeight - 12;
    const purchaseVisible = purchaseButtons.some(button => {
      const rect = button.getBoundingClientRect();
      return rect.top >= topEdge && rect.bottom <= bottomEdge;
    });
    bar.classList.toggle('offer-visible', purchaseVisible);
    bar.inert = purchaseVisible;
    bar.setAttribute('aria-hidden', String(purchaseVisible));
  };
  const queueBarUpdate = () => {
    if (!updateQueued) {
      updateQueued = true;
      requestAnimationFrame(updateBar);
    }
  };
  window.addEventListener('scroll', queueBarUpdate, { passive: true });
  window.addEventListener('resize', queueBarUpdate, { passive: true });
  window.addEventListener('load', queueBarUpdate);
  queueBarUpdate();
})();
