function invokeHandler(handler, vnode, event) {
    if (typeof handler === 'function') {
        handler.call(vnode, event, vnode)
    }
    else if (typeof handler === 'object') {
        if (typeof handler[0] === 'function') {
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode)
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}

function handleEvent(event, vnode) {
    let name = event.type, on = vnode.data.on
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event)
    }
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
        listener.vnode = vnode
        if (!oldOn) {
            for (name in on) {
                elm.addEventListener(name, listener, false);                
            }
        }
        else {
            for (name in on) {
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
export default {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
}