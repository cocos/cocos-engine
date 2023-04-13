export const cocosConfig = {
    default: {
        projectName: 'MyGame',
    },
    cmake: {
        windows: {
            generators: [
                {
                    G: 'Visual Studio 17 2022',
                    V: '2022',
                },
                {
                    G: 'Visual Studio 16 2019',
                    V: '2019',
                },
                {
                    G: 'Visual Studio 15 2017',
                    V: '2017',
                },
                {
                    G: 'Visual Studio 14 2015',
                    V: '2015',
                },
                {
                    G: 'Visual Studio 12 2013',
                    V: '2013',
                },
                {
                    G: 'Visual Studio 11 2012',
                    V: '2012',
                },
                {
                    G: 'Visual Studio 10 2010',
                    V: '2010',
                },
                {
                    G: 'Visual Studio 9 2008',
                    V: '2008',
                },
            ],
        },
    },
};
