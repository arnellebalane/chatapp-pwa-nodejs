/**
 *  Wraps a function and ensures that it is only called once.
 *
 *  @param {Function} fn The function to be wrapped.
 **/
function once(fn) {
    const _once = _ => {
        if (_once.called) return null;
        _once.called = true;

        fn.call(null);
    };
    _once.called = false;
    return _once;
}
