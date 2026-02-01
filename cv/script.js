/**
 * Europass-style CV - Interactive functionality
 * Print, PDF download, Dark/Light theme toggle
 */

(function () {
  'use strict';

  const DOM = {
    btnPrint: document.getElementById('btn-print'),
    btnPdf: document.getElementById('btn-pdf'),
    btnTheme: document.getElementById('btn-theme'),
    body: document.body,
    container: document.getElementById('cv-container'),
  };

  const THEME_KEY = 'cv-theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';

  /**
   * Initialize theme from localStorage or system preference
   */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? THEME_DARK : THEME_LIGHT);
    setTheme(theme);
    updateThemeButton(theme);
  }

  /**
   * Apply theme to document
   * @param {string} theme - 'light' or 'dark'
   */
  function setTheme(theme) {
    if (theme === THEME_DARK) {
      DOM.body.setAttribute('data-theme', THEME_DARK);
    } else {
      DOM.body.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Update theme toggle button label
   * @param {string} theme - current theme
   */
  function updateThemeButton(theme) {
    if (!DOM.btnTheme) return;
    DOM.btnTheme.textContent = theme === THEME_DARK ? 'Light mode' : 'Dark mode';
  }

  /**
   * Toggle between light and dark theme
   */
  function toggleTheme() {
    const current = DOM.body.getAttribute('data-theme') === THEME_DARK ? THEME_DARK : THEME_LIGHT;
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    setTheme(next);
    updateThemeButton(next);
  }

  /**
   * Print CV (opens native print dialog)
   */
  function printCV() {
    window.print();
  }

  /**
   * Download CV as PDF via browser print dialog with "Save as PDF" destination
   * User chooses "Save as PDF" in the print dialog
   */
  function downloadPdf() {
    const link = document.querySelector('link[href*="style.css"]');
    const cssHref = link ? (link.href || 'style.css') : 'style.css';
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download as PDF, or use Print and choose "Save as PDF".');
      return;
    }
    const footerHtml = DOM.container ? DOM.container.querySelector('.cv-footer') : null;
    const clone = DOM.container ? DOM.container.cloneNode(true) : null;
    if (clone) {
      const footer = clone.querySelector('.cv-footer');
      if (footer) footer.remove();
    }
    const content = clone ? clone.outerHTML : document.getElementById('cv-container').innerHTML;
    printWindow.document.write(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Kassahun Tigabu Teshome - CV</title>' +
      '<link rel="stylesheet" href="' + cssHref + '"></head><body>' + content + '</body></html>'
    );
    printWindow.document.close();
    printWindow.focus();
    setTimeout(function () {
      printWindow.print();
      printWindow.onafterprint = function () { printWindow.close(); };
    }, 300);
  }

  /**
   * Attach event listeners
   */
  function bindEvents() {
    if (DOM.btnPrint) {
      DOM.btnPrint.addEventListener('click', printCV);
    }
    if (DOM.btnPdf) {
      DOM.btnPdf.addEventListener('click', downloadPdf);
    }
    if (DOM.btnTheme) {
      DOM.btnTheme.addEventListener('click', toggleTheme);
    }
  }

  /**
   * Run on DOM ready
   */
  function init() {
    initTheme();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
