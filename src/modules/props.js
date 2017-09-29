let updateProps = function(oldVnode, vnode) {
    let key, cur, old, 
        elm = vnode.elm,
        oldProps = oldVnode.data.props,
        props = vnode.data.props
    if (!oldProps && !props) return
    if (oldProps === props) return
    oldProps = oldProps || {}
    props = props || {}
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key]
        }
    }
    for (key in props) {
        cur = props[key]
        old = oldProps[key]
        //如果新旧节点属性不同，且对比的属性不是value或者elm上对应属性和新属性也不同，那么就需要更新
        if (old != cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur
        }       
    }
}
export default {
    create: updateProps,
    update: updateProps
}