const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
//冒号
const colonChar = 58;
//小写x
const xChar = 120;
let updateAttrs = function(oldVnode, vnode) {
    var key, elm = vnde.elm, 
    oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs
    if (!oldAttrs && attrs) return 
    if (oldAttrs === attrs) return 
    oldAttrs = oldAttrs || {}
    attrs = attrs || {}
    for (key in attrs) {
        var cur = attrs[key]
        var old = oldAttrs[key]
        if (old != cur) {
            if (cur === true) {
                elm.setAttribute(key, '')
            }
            else if (cur === false) {
                elm.removeAttribute(key);
            }
            else {
                if (key.charCodeAt(0) !== xChar) {
                    elm.setAttribute(key, cur);
                }
                else if (key.charCodeAt(3) === colonChar) {
                    // Assume xml namespace
                    elm.setAttributeNS(xmlNS, key, cur);
                }
                else if (key.charCodeAt(5) === colonChar) {
                    // Assume xlink namespace
                    elm.setAttributeNS(xlinkNS, key, cur);
                }
                else {
                    elm.setAttribute(key, cur);
                }
            }
        }
    }
    for (key in oldAttrs) {
        if (! (key in attrs)) {
            elm.removeAttribute(key)
        }
    } 
}
export default {
    create: updateAttrs, 
    update: updateAttrs
}