// ==UserScript==
// @name         Google Search
// @namespace    srazzano
// @version      1.0.1
// @description  Layout and Theme
// @author       Sonny Razzano a.k.a. srazzano
// @match        https://www.google.com/search*
// @icon         https://raw.githubusercontent.com/srazzano/Images/master/googleicon64.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {

  'use strict';

  const openInterval = 20,
        timerLong = 10000,
        timerShort = 1000,
        dateTimeFormatCount = 9,
        am = 'AM',
        pm = 'PM',
        arrow = '\u21D2',
        asterisk = '\u002A', // '*'
        bullet = '•',
        clock = '\u23F0', // '⏰'
        comma = ',',
        heart = '❤️',
        hyphen = '-',
        slash = '/',
        space = ' ',
        star = '*',
        customFormat = 'Add a custom format in script line ',
        hideShow = bullet + ' Left-click to Hide/Show Date/Time',
        addRemoveText = bullet + ' Left-click to Add/Remove :seconds\n' + bullet + ' Shift + Left-click to Add/Remove AM/PM\n' + bullet + ' Ctrl + Left-click to change Date format\n' + bullet + ' Alt + Left-click toggle link target to ',
        DayNameAbbr = 'Sun.,Mon.,Tue.,Wed.,Thu.,Fri.,Sat.',
        DayName = 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
        MonthNameAbbr = 'Jan.,Feb.,Mar.,Apr.,May,Jun.,Jul.,Aug.,Sep.,Oct.,Nov.,Dec.',
        MonthName = 'January,February,March,April,May,June,July,August,September,October,November,December',
        MonthNum = '1,2,3,4,5,6,7,8,9,10,11,12',
        MonthNo = '01,02,03,04,05,06,07,08,09,10,11,12',
        DayNum = '"",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
        DayNo = '"",01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31',
        DayOrd = '"",1st,2nd,3rd,4th,5th,6th,7th,8th,9th,10th,11th,12th,13th,14th,15th,16th,17th,18th,19th,20th,21st,22nd,23rd,24th,25th,26th,27th,28th,29th,30th,31st',
        daynameabbr = DayNameAbbr.split(','),
        dayname = DayName.split(','),
        monthnameabbr = MonthNameAbbr.split(','),
        monthname = MonthName.split(','),
        monthnum = MonthNum.split(','),
        monthno = MonthNo.split(','),
        daynum = DayNum.split(','),
        dayno = DayNo.split(','),
        dayord = DayOrd.split(','),
        wallpaperImageText = 'Wallpaper image',
        changeWallpaperTooltip = 'Change Wallpaper',
        inputTooltip = '0 - 51',
        githubSite = 'https://raw.githubusercontent.com/Razzano/My_Wallpaper_Images/master/image',
        imgCalendar = 'https://raw.githubusercontent.com/Razzano/My_Images/master/imageCalendar.png',
        imgClock = 'https://raw.githubusercontent.com/Razzano/My_Images/master/imageClock32.png',
        downArrow = 'https://raw.githubusercontent.com/Razzano/My_Images/master/downArrow.png',
        upArrow = 'https://raw.githubusercontent.com/Razzano/My_Images/master/upArrow.png',
        body = $q('body#gsr'),
        div1 = $q('#searchform > div.NDnoQ.P3mIxe'),
        divThemer = $c('div', {id: 'themerDiv'}),
        btnThemer = $c('button', {id: 'buttonThemer', innerHTML: wallpaperImageText, title: changeWallpaperTooltip, onclick: e => wallpaperButtonChanger(e)}),
        inpThemer = $c('input', {id: 'inputThemer', type: 'number', value: GM_getValue('wallpaperImage'), title: inputTooltip, oninput: e => wallpaperInputChanger(e)}),
        btnDown = $c('button', {id: 'buttonDown', style: 'background-image: url(' + downArrow + ') !important;', title: '', onclick: e => wallpaperButtonChanger(e)}),
        dateTimeContainer = $c('div', {id: 'dateTimeContainer'}),
        imageCalendar = $c('img', {id: 'gCalendar', src: imgCalendar, title: hideShow, onmousedown: e => dateTimeToggle(e)}),
        dateTime = $c('span', {id: 'dateTime', className: 'gBtn', onmousedown: e => dateTimeToggleSecondsAmPm(e)});

  let initInterval,
      clockInterval;

  function $c(type, props) {
    let node = document.createElement(type);
    if (props && typeof props == 'object') for (let prop in props) typeof node[prop] == 'undefined' ? node.setAttribute(prop, props[prop]) : node[prop] = props[prop];
    return node;
  }

  function $q(el, all) {
    if (all) return document.querySelectorAll(el);
    return document.querySelector(el);
  }

  function insertAfter(newNode, refNode) {
    if (refNode.nextSibling) return refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    return refNode.parentNode.appendChild(newNode);
  }

  function dateTimeFormat(int) {
    if (!GM_getValue('defaultDateTimeView')) return;
    let date = new Date(),
        dy = date.getDay(),
        mth = date.getMonth(),
        dt = date.getDate(),
        yr = date.getFullYear(),
        hr = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds(),
        w = daynameabbr[dy],
        ww = dayname[dy],
        m = monthnum[mth],
        mm = monthno[mth],
        mmm = monthnameabbr[mth],
        mmmm = monthname[mth],
        d = daynum[dt],
        dd = dayno[dt],
        ddd = dayord[dt],
        yy = yr - 2000,
        yyyy = yr,
        hr12, hr24, ampm;
    if (hr > 12) {hr12 = hr - 12; hr24 = hr}
    else {hr12 = hr; hr24 = hr}
    if (hr < 10) {hr12 = hr; hr24 = '0' + hr}
    if (hr === 0) {hr12 = 12; hr24 = '00'}
    min < 10 ? min = ':0' + min : min = ':' + min;
    if (GM_getValue('defaultSecondsView')) sec < 10 ? sec = ':0' + sec : sec = ':' + sec;
    else sec = '';
    if (GM_getValue('defaultAMPM')) hr < 12 ? ampm = am : ampm = pm;
    else ampm = '';
    switch (int) {
      // RETURN OPTIONS: (w / ww) + (m / mm / mmm / mmmm) + (d / dd / ddd) +  (yy / yyyy) + (hr12 / hr24) + (min) + (sec) + (ampm) special characters: arrow, asterisk, bullet, comma, hyphen, slash, space, star
      case 1: return ww + space + arrow + space + mmmm + space + ddd + comma + space + yyyy + space + clock + space + hr12 + min + sec + space + ampm; // Sunday • March 1??, 2021 ? 12:34 AM
      case 2: return w + space + bullet + space + mmm + space + d + comma + space + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • Mar. 1, 2021 • 12:34 AM
      case 3: return w + space + arrow + space + mmm + space + dd + comma + space + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • Mar. 01, 2021 • 12:34 AM
      case 4: return w + space + bullet + space + m + hyphen + d + hyphen + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • 3-1-2021 • 12:34 AM
      case 5: return w + space + bullet + space + mm + hyphen + dd + hyphen + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • 03-01-2021 • 12:34 AM
      case 6: return w + space + bullet + space + m + slash + d + slash + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • 3/1/2021 • 12:34 AM
      case 7: return w + space + bullet + space + mm + slash + dd + slash + yyyy + space + bullet + space + hr12 + min + sec + space + ampm; // Sun. • 03/01/2021 • 12:34 AM
      // Delete "customFormatText + 133" or "customFormatText + 134" text below and add return options with bullet, comma, hyphen, slash, space, star characters.
      case 8: return customFormat + 133;
      case 9: return customFormat + 134;
  } }

  function dateTimeDefault() {
    dateTime.hidden = false;
    dateTime.textContent = dateTimeFormat(GM_getValue('dateFormat'));
    dateTime.title = getText();
    dateTimeTimer();
  }

  function dateTimeTimer() {
    clearInterval(clockInterval);
    if (!GM_getValue('defaultDateTimeView')) return;
    if (GM_getValue('defaultSecondsView')) clockInterval = setInterval(function() {dateTime.textContent = dateTimeFormat(GM_getValue('dateFormat'))}, timerShort);
    else clockInterval = setInterval(function() {dateTime.textContent = dateTimeFormat(GM_getValue('dateFormat'))}, timerLong);
  }

  function dateTimeToggle(e) {
    let bool;
    if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.button === 0) {
      bool = dateTime.hidden !== true ? true : false;
      dateTime.hidden = bool;
      GM_setValue('defaultDateTimeView', !bool);
      if (bool) clearInterval(clockInterval);
      else {dateTime.textContent = dateTimeFormat(GM_getValue('dateFormat')); dateTimeTimer()}
  } }

  function dateTimeToggleSecondsAmPm(e) {
    if (!e.button === 0) return;
    let bool1, bool2, int, target;
    e.preventDefault();
    if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.button === 0) {
      bool1 = GM_getValue('defaultSecondsView') !== true ? true : false;
      GM_setValue('defaultSecondsView', bool1);
      dateTimeTimer();
    } else if (e.shiftKey && !e.ctrlKey && !e.altKey && e.button === 0) {
      bool2 = GM_getValue('defaultAMPM') !== true ? true : false;
      GM_setValue('defaultAMPM', bool2);
    } else if (!e.shiftKey && e.ctrlKey && !e.altKey && e.button === 0) {
      int = GM_getValue('dateFormat') + 1;
      int < dateTimeFormatCount + 1 ? GM_setValue('dateFormat', int) : GM_setValue('dateFormat', 1);
      dateTime.title = getText();
    } else if (!e.shiftKey && !e.ctrlKey && e.altKey && e.button === 0) {
      target = GM_getValue('linkTarget') !== '_blank' ? GM_setValue('linkTarget', '_blank') : GM_setValue('linkTarget', '_self');
      searchLinksWhere(GM_getValue('linkTarget'));
    }
    dateTime.title = getText();
    dateTime.textContent = dateTimeFormat(GM_getValue('dateFormat'));
  }

  function getText() {
    let target;
    target = GM_getValue('linkTarget') !== '_blank' ? target = '_blank' : target = '_self';
    return addRemoveText + '"' + target + '"';;
  }

  function init() {
    window.removeEventListener('load', () => init());
    try {
      divThemer.appendChild(btnThemer);
      divThemer.appendChild(inpThemer);
      divThemer.appendChild(btnDown);
      div1.insertBefore(divThemer, div1.firstChild);
      dateTimeContainer.appendChild(imageCalendar);
      dateTimeContainer.appendChild(dateTime);
      insertAfter(dateTimeContainer, div1.firstChild.nextSibling);
      if (GM_getValue('defaultDateTimeView')) dateTimeDefault();
      else {dateTime.hidden = true; clearInterval(clockInterval)}
      dateTime.title = getText();
      searchLinksWhere();
      wallpaper(GM_getValue('wallpaperImage'));
    } catch(ex) {}
  }

  function onClose() {
    clearInterval(initInterval);
    clearInterval(clockInterval);
    window.removeEventListener('unload', () => onClose());
  }

  function searchLinksWhere() {
    let links = $q('body#gsr a', true);
    for (let i = 0; i < links.length; i++) links[i].setAttribute('target', GM_getValue('linkTarget'));
    getText();
  }

  function wallpaper(e) {
    if (e === 0) {
      GM_addStyle(''+
        'body#gsr {'+
        '  background: initial !important;'+
        '}'+
      '');
    } else {
      GM_addStyle(''+
        'body#gsr {'+
        '  background:  url(' + githubSite + e +'.jpg) no-repeat center / cover fixed !important;'+
        '}'+
      '');
  } }

  function wallpaperButtonChanger(e) {
    let inp = $q('#inputThemer'),
        num1 = parseInt(inp.value),
        sum = parseInt(num1 + 1),
        sub = parseInt(num1 - 1);
    switch (e.target.id) {
      case 'buttonThemer':
        if (inp.value > 50) inp.value = 0;
        else inp.value = sum;
        break;
      case 'buttonDown':
        if (inp.value > 0) inp.value = sub;
        else inp.value = 51;
    }
    GM_setValue('wallpaperImage', inp.value);
    wallpaper(inp.value);
  }

  function wallpaperInputChanger(e) {
    let inp = $q('#inputThemer');
    if (inp.value > 51) inp.value = 51;
    else if (inp.value < 0) inp.value = 0;
    else inp.value = inp.value;
    GM_setValue('wallpaperImage', inp.value);
    wallpaper(inp.value);
  }

  function wallpaperSite() {
    let num = GM_getValue('wallpaperImage');
    wallpaper(num);
  }

  if (!GM_getValue('dateFormat')) GM_setValue('dateFormat', 1);
  if (!GM_getValue('defaultAMPM')) GM_setValue('defaultAMPM', false);
  if (!GM_getValue('defaultDateTimeView')) GM_setValue('defaultDateTimeView', false);
  if (!GM_getValue('defaultSecondsView')) GM_setValue('defaultSecondsView', false);
  if (!GM_getValue('linkTarget')) GM_setValue('linkTarget', '_blank');
  if (!GM_getValue('wallpaperImage')) GM_setValue('wallpaperImage', 0);

  initInterval = setInterval(() => {
    if (!dateTimeContainer || !divThemer) init();
    else clearInterval(initInterval);
  }, openInterval);

  window.addEventListener('load', () => init());
  window.addEventListener('unload', () => onClose());

  GM_addStyle(''+
    'body#gsr {'+
    '  background:  url(' + githubSite + GM_getValue('wallpaperImage') +'.jpg) no-repeat center / cover fixed !important;'+
    '}'+
    'body#gsr div.logo,'+
    'body#gsr picture > img {'+
    '  display: none !important;'+
    '}'+
    'body#gsr #cnt > div.JryvJ > div {'+
    '  border-bottom: none !important;'+
    '}'+
    'body#gsr #searchform {'+
    '  background: #000 !important;'+
    '}'+
    'body#gsr #hdtb-sc {'+
    '  margin-top: 30px !important;'+
    '}'+
    'body#gsr #themerDiv {'+
    '  background: transparent !important;'+
    '  color: #FFF !important;'+
    '  left: 8px !important;'+
    '  position: fixed !important;'+
    '  top: 10px !important;'+
    '  z-index: 900 !important;'+
    '}'+
    'body#gsr #buttonThemer,'+
    'body#gsr #inputThemer {'+
    '  border: none !important;'+
    '  color: #FFF !important;'+
    '  opacity: .7 !important;'+
    '  text-shadow: 1px 1px 2px #000 !important;'+
    '}'+
    'body#gsr #buttonThemer {'+
    '  background-color: transparent !important;'+
    '  background-repeat: no-repeat !important;'+
    '  background-position: right !important;'+
    '  margin: 0 !important;'+
    '  position: relative !important;'+
    '  top: -1px !important;'+
    '  width: 115px !important;'+
    '}'+
    'body#gsr #inputThemer {'+
    '  background: transparent !important;'+
    '  margin: 0 !important;'+
    '  width: 20px !important;'+
    '  text-align: center !important;'+
    '}'+
    'body#gsr #buttonDown {'+
    '  background: transparent !important;'+
    '  border: none !important;'+
    '  color: #FFF !important;'+
    '  opacity: .7 !important;'+
    '  cursor: pointer !important;'+
    '  height: 10px !important;'+
    '  margin: 0 !important;'+
    '  position: relative !important;'+
    '  text-shadow: 1px 1px 2px #000 !important;'+
    '  top: 0 !important;'+
    '  width: 11px !important;'+
    '}'+
    'body#gsr #buttonThemer:hover,'+
    'body#gsr #buttonDown:hover {'+
    '  opacity: 1 !important;'+
    '  cursor: pointer !important;'+
    '}'+
    'body#gsr #inputThemer::-webkit-inner-spin-button,'+
    'body#gsr #inputThemer::-webkit-outer-spin-button,'+
    'body#gsr #inputThemer::-webkit-inner-spin-button,'+
    'body#gsr #inputThemer::-webkit-outer-spin-button {'+
    '  display: none !important;'+
    '}'+
    'body#gsr #dateTimeContainer {'+
    '  position: relative !important;'+
    '  width: 415px !important;'+
    '  z-index: 999 !important;'+
    '}'+
    'body#gsr #gCalendar {'+
    '  border: none !important;'+
    '  cursor: pointer !important;'+
    '  filter: grayscale(1) brightness(.65) !important;'+
    '  height: 40px !important;'+
    '  width: 40px !important;'+
    '}'+
    'body#gsr #dateTime {'+
    '  margin: 0 !important;'+
    '  position: relative !important;'+
    '  top: -14px !important;'+
    '}'+
    'body#gsr #gCalendar:hover + #dateTime {'+
    '  background: #900 !important;'+
    '  border-color: #C00 !important;'+
    '  color: #FFF !important;'+
    '}'+
    'body#gsr #dateTimeContainer:hover > #gCalendar {'+
    '  filter: none !important;'+
    '  opacity: .7 !important;'+
    '}'+
    'body#gsr #dateTimeContainer:hover > #gCalendar:hover {'+
    '  opacity: 1 !important;'+
    '}'+
    'body#gsr #dateTimeContainer > #dateTime {'+
    '  background-color: transparent !important;'+
    '  border: 1px solid transparent !important;'+
    '  border-radius: 4px !important;'+
    '  box-shadow: none !important;'+
    '  color: #FFF !important;'+
    '  cursor: pointer !important;'+
    '  font: 14px monospace !important;'+
    '  min-width: 100px !important;'+
    '  padding: 5px 8px 6px 8px !important;'+
    '  text-shadow: 1px 1px 2px #000 !important;'+
    '}'+
    'body#gsr #dateTimeContainer > #dateTime:hover {'+
    '  background-color: #181A1B !important;'+
    '  border: 1px solid #000 !important;'+
    '}'+
    'body#gsr #gb > div.gb_cd.gb_0.gb_I > div {'+
    '  display: none !important;'+
    '}'+
    'body#gsr #gbwa > div,'+
    'body#gsr #gb > div.gb_z {'+
    '  padding: 0 !important;'+
    '}'+
    'body#gsr #gbwa > div > a:hover {'+
    '  background-color: #181A1B !important;'+
    '  border: 1px solid #333 !important;'+
    '  color: #FFF !important;'+
    '}'+
    'body#gsr .gb_Aa {'+
    '  height: 40px !important;'+
    '  position: relative !important;'+
    '  top: -4px !important;'+
    '  width: 40px !important;'+
    '}'+
    'body#gsr .logo,'+
    'body#gsr .XDyW0e,'+
    'body#gsr #footcnt {'+
    '  display: none !important;'+
    '}'+
    'body#gsr .sfbg {'+
    '  opacity: 0 !important;'+
    '}'+
    'body#gsr .sfbg,'+
    'body#gsr #pTwnEc,'+
    'body#gsr .appbar,'+
    'body#gsr #searchform div:last-of-type:not(.Q3DXx) {'+
    '  background: transparent !important;'+
    '}'+
    'body#gsr #searchform > div.NDnoQ.P3mIxe{'+
    '  background: #000 !important;'+
    '}'+
    'body#gsr > #searchform {'+
    '  margin-top: -2px !important;'+
    '  top: 0 !important;'+
    '}'+
    'body#gsr .RNNXgb {'+
    '  border-radius: 24px !important;'+
    '  margin: 0 !important;'+
    '  width: 90% !important;'+
    '}'+
    'body#gsr .minidiv .RNNXgb {'+
    '  border-radius: 24px !important;'+
    '  margin: 0 !important;'+
    '  padding: 6px 0 !important;'+
    '  width: 90% !important;'+
    '}'+
    'body#gsr .GLcBOb {'+
    '  border-bottom: none !important;'+
    '}'+
    'body#gsr #rcnt {'+
    '  background: radial-gradient(#000, transparent) !important;'+
    '}'+
    'body#gsr #gb > div > div[style*="width: 328px;"] {'+
    '  height: calc(-140px + 100vh) !important;'+
    '}'+
    'body#gsr div.dodTBe {'+
    '  height: auto !important;'+
    '  min-height: 0 !important;'+
    '}'+
  '');

})();
