export default function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key
    return { sel, data, children, text, elm, key }
} 