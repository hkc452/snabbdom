let raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout
let nextFrame = function(fn){
    raf(function(){
        raf(fn)
    })
}
function setNextFrame(obj, prop, val){
    nextFrame(function(){
        obj[prop] = val
    })
}
function updateStyle() {
    let cur, name, elm = vnode.elm, 
        oldStyle = oldVnode.data.style,
        style = vnode.data.style
    if (!oldStyle && !style) return 
    if (oldStyle === style) return
    oldStyle = oldStyle || {}
    style = style || {}
    let oldHasDel = 'delayed' in oldStyle
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = ''
            }
        }
    }
    for (name in  style) {
        cur = style[name]
        if (name === 'delayed' && style.delayed) {
            for (let name2 in style.delayed) {
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur)
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur)
            }
            else {
                elm.style[name] = cur
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    let style , name, elm = vnode.elm, s = vnode.data.style
    if (!s || !(style = s.destroy)) return 
    for (name in style) {
        elm.style[name] = style[name]
    }
}
function applyRemoveStyle(vnode, rm) {
    let s = vnode.data.style
    if (!s || !s.remove) {
        rm()
        return
    }
    let name, elm = vnode.elm, i = 0, comStyle, style = s.remove, amout = 0, applied = []
    for (name in style) {
        applied.push(name)
        elm.style[name] = style[name] 
    }
    comStyle = getComputedStyle(elm)
    let props = comStyle['tansition-property'].split(', ')
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEvenListener('transitionend', function(e) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    })
}
export default {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
}