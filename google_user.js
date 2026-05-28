// ==UserScript==
// @name         Google Search
// @namespace    srazzano
// @version      1.0.1
// @description  Layout and Theme
// @author       Sonny Razzano a.k.a. srazzano
// @match        https://www.google.com/search*
// @match        https://google.com/search*
// @icon         https://raw.githubusercontent.com/srazzano/Images/master/googleicon64.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(() => {

  'use strict';

  const $c = (type, props = {}, ...children) => {
    const node = document.createElement(type);
    Object.entries(props).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key.startsWith('on') && typeof value === 'function') {
        const event = key.substring(2).toLowerCase();
        node.addEventListener(event, value);
      }
      else if (key === 'style' && typeof value === 'object') {
        Object.assign(node.style, value);
      }
      else if (key === 'className' || key === 'class') {
        node.className = Array.isArray(value) ? value.join(' ') : value;
      }
      else if (key in node) {
        node[key] = value;
      }
      else {
        node.setAttribute(key, value);
      }
    });
    children.flat(Infinity).forEach(child => {
      if (child == null) return;
      if (typeof child === 'string' || typeof child === 'number') {
        node.appendChild(document.createTextNode(child));
      }
      else if (child instanceof Node) {
        node.appendChild(child);
      }
    });
    return node;
  };

  const $id = (id) => document.getElementById(id);

  const $q = (sel, ctx = document) => ctx?.querySelector(sel) ?? null;

  const $qa = (sel, ctx = document) => Array.from(ctx?.querySelectorAll(sel) ?? []);

  const insertAfter = (newEl, refEl) => {
    if (!refEl || !refEl.parentNode) {
      console.warn('insertAfter: refEl is null or has no parentNode', refEl);
      return null;
    }
    refEl.parentNode.insertBefore(newEl, refEl.nextSibling);
    return newEl;
  };

  const prepend = (parent, child) => {
    parent.insertBefore(child, parent.firstChild);
    return child;
  };

  const removeDupes = (className) => {
    document.querySelectorAll('.' + className).forEach((el, i) => {
      if (i > 0) {
        el.remove();
      }
    });
  };

  const githubSite = 'https://raw.githubusercontent.com/Razzano/My_Wallpaper_Images/master/image';

  let currentWallpaperStyle = null;
  const applyWallpaper = (num) => {
    if (currentWallpaperStyle) {
      currentWallpaperStyle.remove();
      currentWallpaperStyle = null;
    }
    num = parseInt(num) || 0;
    if (num === 0) return;
    const css = `
      body#gsr {
        background: url(${githubSite}${num}.jpg) no-repeat center center / cover fixed !important;
      }
    `;
    currentWallpaperStyle = GM_addStyle(css);
  };

  const wallpaperButtonChanger = (e) => {
    let inp = $q('#inputThemer'),
        val = inp.value;
    if (e.target.id.includes('Down')) {
      val--;
    } else {
      val++;
    }
    if (val > 52) {
      val = 0;
    }
    if (val < 0) {
      val = 52;
    }
    inp.value = val;
    GM_setValue('wallpaperImage', val);
    applyWallpaper(val);
  }

  const wallpaperInputChanger = () => {
    const inpThemer = $id('inputThemer');
    let val = parseInt(inpThemer.value) || 0;
    val = Math.max(0, Math.min(52, val));
    inpThemer.value = val;
    GM_setValue('wallpaperImage', val);
    applyWallpaper(val);
  }

  const init = () => {
    const body = document.body;
    if (!body) return;
    const form = $id('tsf');
    const divThemer = $c('div', {
      id: 'divThemer'
    });
    const buttonUpThemer = $c('button', {
      id: 'buttonUpThemer',
      textContent: 'Wallpaper image',
      title: 'Change Wallpaper',
      onclick: wallpaperButtonChanger
    });
    const inputThemer = $c('input', {
      id: 'inputThemer',
      type: 'number',
      value: GM_getValue('wallpaperImage', 0),
      title: '0 - 52',
      oninput: wallpaperInputChanger
    });
    const buttonDownThemer = $c('button', {
      id: 'buttonDownThemer',
      textContent: 'Wallpaper image',
      title: 'Change Wallpaper',
      onclick: e => wallpaperButtonChanger(e)
    });
    divThemer.append(buttonUpThemer, inputThemer, buttonDownThemer);
    insertAfter(divThemer, form);
    applyWallpaper(GM_getValue('wallpaperImage'));
  }

  if (GM_getValue('wallpaperImage') === undefined) GM_setValue('wallpaperImage', 0);

  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  let e = GM_getValue('wallpaperImage');
  const imageUrl = `${githubSite}${e}.jpg`;
  GM_addStyle(`
    /*body#gsr {
      background: url(${imageUrl}) no-repeat center center / cover fixed !important;
    }*/
    body#gsr .xrOgrb {
     padding-top: 0px !important;
    }
    body#gsr #searchform {
      position: relative !important;
      top: -10px !important;
    }
    body#gsr #gb > div.gb_td.gb_0.gb_I > div,
    body#gsr div.logo,
    body#gsr picture > img,
    body#gsr #gb > div.gb_Ad.gb_6.gb_L > div {
      display: none !important;
    }
    body#gsr #cnt > div.JryvJ > div {
      border-bottom: none !important;
    }
    body#gsr #searchform {
      background: #000 !important;
    }
    body#gsr #hdtb-sc {
      margin-top: 30px !important;
    }
    body#gsr #divThemer {
      background: transparent !important;
      color: #FFF !important;
      cursor: pointer !important;
      margin: auto !important;
      padding: 0px !important;
      transform: translateX(-80%) !important;
    }
    body#gsr #buttonUpThemer {
      background-image: url(https://raw.githubusercontent.com/Razzano/My_Images/master/upArrow.png) !important;
      background-color: transparent !important;
      background-repeat: no-repeat !important;
      background-position: right !important;
      border: none !important;
      color: #FFF !important;
      margin: 0px !important;
      opacity: .7 !important;
      position: relative !important;
      text-shadow: 1px 1px 2px #000 !important;
      top: -1px !important;
      width: 140px !important;
      height: 36px !important;
    }
    body#gsr #inputThemer {
      background: transparent !important;
      border: none !important;
      color: #FFF !important;
      cursor: pointer !important;
      margin: 0px !important;
      opacity: .7 !important;
      text-align: center !important;
      text-shadow: 1px 1px 2px #000 !important;
      width: 30px !important;
      height: 36px !important;
    }
    body#gsr #buttonDownThemer {
      background-image: url(https://raw.githubusercontent.com/Razzano/My_Images/master/downArrow.png) !important;
      background-color: transparent !important;
      background-repeat: no-repeat !important;
      background-position: left !important;
      border: none !important;
      color: #FFF !important;
      cursor: pointer !important;
      opacity: .7 !important;
      cursor: pointer !important;
      margin: 0px 0px 0px 0px !important;
      position: relative !important;
      text-shadow: 1px 1px 2px #000 !important;
      top: 0px !important;
      width: 140px !important;
      height: 36px !important;
    }
    body#gsr #buttonUpThemer:hover,
    body#gsr #buttonDownThemer:hover,
    body#gsr #inputThemer:hover,
    body#gsr #inputThemer:focus-within {
      opacity: 1 !important;
    }
    body#gsr #inputThemer::-webkit-inner-spin-button,
    body#gsr #inputThemer::-webkit-outer-spin-button,
    body#gsr #inputThemer::-webkit-inner-spin-button,
    body#gsr #inputThemer::-webkit-outer-spin-button {
      display: none !important;
    }
    body#gsr #gb > div.gb_cd.gb_0.gb_I > div {
      display: none !important;
    }
    body#gsr #gbwa > div,
    body#gsr #gb > div.gb_z {
      padding: 0 !important;
    }
    body#gsr #gbwa > div > a:hover {
      background-color: #181A1B !important;
      border: 1px solid #333 !important;
      color: #FFF !important;
    }
    body#gsr .gb_Aa {
      height: 40px !important;
      position: relative !important;
      top: -4px !important;
      width: 40px !important;
    }
    body#gsr .logo,
    body#gsr .XDyW0e,
    body#gsr #footcnt {
      display: none !important;
    }
    body#gsr .sfbg {
      opacity: 0 !important;
    }
    body#gsr .sfbg,
    body#gsr #pTwnEc,
    body#gsr .appbar,
    body#gsr #searchform div:last-of-type:not(.Q3DXx) {
      background: transparent !important;
    }
    body#gsr #searchform > div.NDnoQ.P3mIxe{
      background: #000 !important;
    }
    body#gsr > #searchform {
      margin-top: -2px !important;
      top: 0 !important;
    }
    body#gsr .RNNXgb {
      border-radius: 24px !important;
      margin: 0 !important;
    }
    body#gsr .GLcBOb {
      border-bottom: none !important;
    }
    body#gsr #rcnt > div {
      background: rgba(0, 0, 0, .6) !important;
    }
    body#gsr #center_col,
    body#gsr #rhs {
      padding: 0 10px !important;
    }
    body#gsr .jOAHU {
      border-left: none !important;
    }
    body#gsr #gb > div.gb_z > div:nth-child(2) {
      height: calc(-70px + 100vh) !important;
    }
    body#gsr div.dodTBe {
      height: auto !important;
      min-height: 0 !important;
    }
    body#gsr .bzXtMb {
      max-width: 100vw !important;
      width: 1330px !important;
    }
    body#gsr .zLSRge {
      border-bottom: none !important;
    }
  `);
})();
