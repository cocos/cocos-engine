/* eslint-disable */
// import HTMLElement from './HTMLElement';

// export default class HTMLImageElement extends HTMLElement
// {
//     constructor(){
//         super('img')
//     }
// };

import HTMLElement from './HTMLElement'

const imageConstructor = swan.createImage().constructor;

// imageConstructor.__proto__.__proto__ = new HTMLElement();

export default imageConstructor;
