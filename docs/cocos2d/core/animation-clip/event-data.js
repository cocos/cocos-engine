// frame    : The exactly time in second.
// func     : Callback function name
// params   : Callback parameters
[
    { frame: 0, func: 'onAnimationEvent1', params:['param-1', 'param-2'] },
    { frame: 2, func: 'onAnimationEvent3', params:['param-1', 'param-2'] },
    { frame: 3, func: 'onAnimationEvent2', params:['param-1'] },
    // The second event at frame 3
    { frame: 3, func: 'onAnimationEvent4', params:['param-1'] },
    { frame: 4, func: 'onAnimationEvent4', params:['param-1'] }
]