{
    // 根节点不用查找路径
    // root properties
    props: {
        x: [
            { frame: 0, value: 0, curve: [0,0.5,0.5,1] },
            { frame: 1, value: 200, curve: null }
        ]
    },
    comps: {
        // component
        'comp-1': {
            // component properties
            'prop-1': [
                { frame: 0, value: 10, curve: [0,0.5,0.5,1] },
                { frame: 1, value: 20, curve: null }
            ]
        }
    },
    paths: {
        // key 为节点到root的路径名, 通过cc.find找到
        'foo/bar': {
            // node properties
            props: {
                x: [
                    { frame: 0, value: 0, curve: [0,0.5,0.5,1]
                    { frame: 1, value: 200, curve: null }
                ]
            },
            comps: {
                // component
                'comp-1': {
                    // component property
                    'prop-1': [
                        { frame: 0, value: 10, curve: [0,0.5,0.
                            { frame: 1, value: 20, curve: null }
                        ]
                        }
                }
            },
            'hello': {
                props: {
                    position: [
                        {
                            frame: 0,
                            value: [0,0],
                            motionPath: [
                                [320, 240, 0, 240, 640, 240],
                                [640, 0, 400, 0, 1000, 0]
                            ]
                        },
                        { frame: 5, value: [640, 480] }
                    ]
                }
            }
        }
    }
}