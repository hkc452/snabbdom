import vnode from 'src/vnode';
import is from 'src/is';
import h from 'src/h'
import htmldomapi from 'src/htmldomapi'
function isUndef(s) { return s === undefined }
function isDef(s) { return s !== undefined }
const emptyNode = vnode('', {}, [], undefined, undefined )
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel
}
function isVnode(vnode) {
    return vnode.sel !== undefined
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    let i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init(modules, domApi) {
    let i, j, cbs = {}
    let api = domApi !== undefined ? domApi : htmldomapi
    for(i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = {}
        for (j = 0; j < modules.length; ++j) {
            let hook = modules[j][hooks[i]]
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook)
            }
        }
    }
    function emptyNodeAt(elm) {
        const id = elm.id ? '#' + elm.id : ''
        const c = elm.className ? '.' + elm.className.split(' ').join('.') : ''
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm)
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if ( --listeners === 0) {
                let parent = api.parentNode(childElm)
                api.removeChild(parent, childElm)
            }
        }
    }
    function createElm(vnode, insertedVnodeQueue) {
        let i, data = vnode.data
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode)
                data = vnode.data
            }
        }
        let children = vnode.children,  sel = vnode.sel
        if ( sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = ''
            }
            vnode.elm = api.createComment(vnode.text)
        }
        else if (sel !== undefined) {
            let hasIdx = sel.indexOf('#')
            let dotIdx = sel.indexOf('.', hasIdx)
            let hash = hasIdx > 0 ? hasIdx : sel.length
            let dot = dotIdx > 0 ? dotIdx : sel.length
            let tag = hasIdx != -1 || dotIdx != -1 ? sel.slice(0, Math.min(hash, dot)) : sel
            //创建elm
            let elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag)
            if (hash < dot) {
                elm.setAttribute('id', sel.slice(hash + 1, dot))
            }
            if (dotIdx > 0) {
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '))
            }
            for(i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode)
            }
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    let ch = children[i]
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue))
                    }
                }
            }
            else if (is.primitive(vnode.text)) {
                api.appendChild(elm, api.createTextNode(text))
            }
            i = vnode.data.hook
            if (isDef(i)) {
                if (i.create) i.create(emptyNode, vnode)
                if (i.insert) insertedVnodeQueue.push(vnode)
            }
        }
        else {
            vnode.elm = api.createTextNode(vnode.text)
        }
        return vnode.elm
    }
    function invokeDestroyHook(vnode) {
        let i , j, data = vnode.data
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode)
            for(i = 0; i < cbs.destroy.length; ++i) 
                cbs.destroy[i](vnode)
            if (vnode.children !== undefined) {
                for(j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j]
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i)
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++ startIdx) {
            let i = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx]
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length +1
                    rm = createRmCb(ch.elm, listeners)
                    for (i = 0; i< listeners.length; ++i) 
                        cbs.remove[i](ch, rm)
                    if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
                        i(ch, rm)
                    }
                    else {
                        rm();
                    }
                }
                else {// Text node
                    api.removeChild(parentElm, ch.elm)
                }
            }
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent, insertedVnodeQueue = []
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]()
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode)
        }
        if (sameVnode(oldVnode, vnode)) {
            
        }
        else {
            elm = oldVnode.elm
            parent = api.parentNode(elm)
            createElm(vnode, insertedVnodeQueue)
            if (parent != null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm))
                removeVnodes(parent, [oldVnode], 0, 0)
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i])
        }
        for (i = 0; i < cbs.post.length; ++i) 
            cbs.post[i]()
        return vnode
    }
}
export {
    h
}