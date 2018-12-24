import Awesomplete from 'awesomplete';
import Headroom from 'headroom.js';
import './sass/main.scss';

require.context('./img', true, /\.(gif|png|jpe?g|svg)$/i);

const toggle = document.getElementById('navbarToggleButton');
const header = document.getElementById('header');
const input = document.getElementById('title-search');

const { protocol, host, pathname } = window.location;

const baseUrl = `${protocol}//${host}${
  pathname.startsWith('/zh/') ? '/zh' : ''
}`;

fetch(`${baseUrl}/titles.json`)
  .then(response => response.json())
  .then(json => {
    new Awesomplete(input, {
      list: json
    });
  })
  .catch(err => console.log('Fetch Error :-S', err));

function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
}

function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += ` ${className}`;
}

function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
    el.className = el.className.replace(reg, ' ');
  }
}

const headroom = new Headroom(header);
headroom.init();

window.onscroll = () => {
  const currentWindowPos =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (currentWindowPos > 0) {
    addClass(header, 'scrolled');
  } else {
    removeClass(header, 'scrolled');
  }
};

toggle.addEventListener('click', () => {
  const content = document.getElementById('navbarSupportedContent');
  const { classList } = content;
  if (classList.contains('collapsed')) {
    addClass(content, 'collapse');
    removeClass(content, 'collapsed');
    addClass(toggle, 'collapsed');
    toggle.setAttribute('aria-expanded', true);
  } else {
    addClass(content, 'collapsed');
    removeClass(content, 'collapse');
    removeClass(toggle, 'collapsed');
    toggle.setAttribute('aria-expanded', false);
  }
});

window.addEventListener('scroll', () => {
  const ele = document.getElementById('main_cover');
  if (ele) {
    ele.style.transform = `translate3d(0px, ${pageYOffset}px, 0px)`;
  }
});

input.addEventListener(
  'awesomplete-selectcomplete',
  function(e) {
    this.selected = e.target.value;
    window.location.href = this.selected;
    e.target.value = null;
  },
  false
);
