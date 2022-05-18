export const cocosConfig = {
    languages: [
        'js',
    ],
    platforms: [
        'ios',
        'mac',
        'windows',
        'android',
        'ios-simulator',
        'huawei-agc',
        'ohos',
        'linux',
        'xr-huaweivr',
        'xr-oculus',
        'xr-pico',
        'xr-rokid',
        'xr-mobile',
    ],
    supportTemplates: ['link', 'default'],
    default: {
        projectName: 'MyGame',
    },
    availableTargetPlatforms: {
        mac: [
            'mac',
            'ios',
            'android',
            'huawei-agc',
            'ohos',
	        'linux',
            'xr-huaweivr',
            'xr-oculus',
            'xr-pico',
            'xr-rokid',
            'xr-mobile',
        ],
        windows: [
            'windows',
            'android',
            'huawei-agc',
            'ohos',
	        'linux',
            'xr-huaweivr',
            'xr-oculus',
            'xr-pico',
            'xr-rokid',
            'xr-mobile',
        ],
    },
    defaultGeneratePlatforms: {
        mac: ['mac', 'ios-simulator'],
        windows: ['windows'],
    },
    cmake: {
        windows: {
            generators: [
                {
                    G: 'Visual Studio 16 2019',
                },
                {
                    G: 'Visual Studio 15 2017',
                },
                {
                    G: 'Visual Studio 14 2015',
                },
                {
                    G: 'Visual Studio 12 2013',
                },
                {
                    G: 'Visual Studio 11 2012',
                },
                {
                    G: 'Visual Studio 10 2010',
                },
                {
                    G: 'Visual Studio 9 2008',
                },
            ],
        },
    },
};
