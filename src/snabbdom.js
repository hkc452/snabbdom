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
    return function patch(oldVnode, vnode) {
        
    }
}
export {
    h
}