
import '../modules/dom.js';

const styles = document.createElement('style');
styles.innerHTML = `
  detail-box {
    display: block;
  }

  detail-box > header {
    -webkit-tap-highlight-color: transparent;
  }

  detail-box > header [detail-box-toggle] {
    width: 2em;
    height: 2em;
    text-align: center;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    cursor: pointer;
  }

  detail-box > header [detail-box-toggle]:before {
    content: " ";
    display: inline-block;
    width: 0; 
    height: 0;
    border-left: 0.55em solid transparent;
    border-right: 0.55em solid transparent;
    border-top: 0.8em solid;
    vertical-align: sub;
    cursor: pointer;
  }

  detail-box[open] header [detail-box-toggle]:before {
    border-top: none;
    border-bottom: 0.8em solid;
  }

  detail-box > section {
    height: 0;
    opacity: 0;
    /* min-width: 100%; */
    transition: height 0.3s ease, opacity 0.4s;
    overflow: hidden;
  }

  detail-box[closed] > section {
    visibility: hidden;
  }

  detail-box[open] > section {
    visibility: visible;
    opacity: 1;
  }
`;

document.head.append(styles);

DOM.addEventDelegate('click', 'detail-box [detail-box-toggle], detail-box > header', e => {
  e.stopPropagation();
  let box = e.target.closest('detail-box');
  if (box.parentElement.hasAttribute('accordion')) {
    box.parentElement.querySelectorAll(':scope       > detail-box').forEach(node => {
      if (node !== box) node.close()
    });
  }
  box.toggle();
});

var DetailBox = globalThis.DetailBox = class DetailBox extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();

    this.addEventListener('transitionend', e => {
      let node = e.target;
      if (node.parentElement === this && node.tagName === 'SECTION' && e.propertyName === 'height') {
        node.style.height = this.hasAttribute('open') ? 'auto' : null;
      }
      this.hasAttribute('open') ? this.removeAttribute('closed') : this.setAttribute('closed', '');
    });
  }
  open (){
    this.setAttribute('open', '');
  }
  close (){
    this.removeAttribute('open');
  }
  toggle(){
    this.toggleAttribute('open');
    if (this.hasAttribute('open') && this.hasAttribute('smooth-scroll')) {
      this.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        DOM.ready.then(e => {
          for (let node of this.children) {
            if (node.tagName === 'SECTION') {
              if (current !== null) {   
                if (node.offsetHeight < node.scrollHeight) {
                  node.style.height = node.scrollHeight + 'px';
                  DOM.fireEvent(this, 'detailboxtoggle', { detail: { open: true } });
                }
              }
              else if (node.offsetHeight > 0) {
                node.style.height = node.offsetHeight + 'px';
                let scroll = this.scrollHeight;
                node.style.height = 0;
                DOM.fireEvent(this, 'detailboxtoggle', { detail: { open: false } });
              }
              break;
            }
          }
        });
    }
  }
};

customElements.define('detail-box', DetailBox);

export { DetailBox };