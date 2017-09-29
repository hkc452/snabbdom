function handleEvent(event, vnode) {
    
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handle.vnode)
    }
}

function updateEventListeners(oldVnode, vnode) {
    let oldOn = oldVnode.data.on,
        oldListener = oldVnode.listener,
        oldElm = oldVnode.elm,
        on = vnode && vnode.data.on,
        elm = vnode && vnode.elm,
        name
    if (oldOn === on) return
    if (oldOn && oldListener) {
        if (!on) {
            for (name in oldOn) {
                oldElm.removeEventListener(name, oldListener, false)
            }
        }
        else {
            for (name in oldOn) {
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false)
                }
            }
        }
    }
    if (on) {
        let listener = vnode.listener = oldVnode.listener 
    }

}