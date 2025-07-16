
import { Pacer } from '../../pal/pacer/pacer-web';

test('pacer', (cb) => {
    const pacer = new Pacer();
    let calledTime = 0;
    pacer.onTick = jest.fn(() => { calledTime++; });
    pacer.start();
    Promise.resolve().then(() => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).not.toBe(0);
                resolve();
            }, 100);
        })
    }).then(() => {
        return new Promise<void>((resolve, reject) => {
            pacer.stop();
            pacer.targetFrameRate = 90;
            let currentCount = calledTime;
            setTimeout(() => {
                expect(calledTime).toBe(currentCount);
                resolve();
            }, 100);
        });
    }).then(() => {
        return new Promise<void>((resolve, reject) => {
            let currentCount = calledTime;
            pacer.start();
            setTimeout(() => {
                expect(calledTime).toBeGreaterThan(currentCount);
                resolve();
            }, 100);
        });
    }).then(() => {
        pacer.targetFrameRate = 5;
        return new Promise<void>((resolve, reject) => {
            let currentCount = calledTime;
            setTimeout(() => {
                expect(calledTime).toBe(currentCount + 1);
            }, 100);
            setTimeout(() => {
                expect(calledTime).toBeGreaterThan(currentCount);
                resolve();
            }, 300)
        });
    }).then(() => {
        pacer.targetFrameRate = 60;
        pacer.onTick = jest.fn(() => {});
        let currentCount = calledTime;
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBe(currentCount);
                expect(pacer.onTick).toBeCalled();
                resolve();
            }, 100);
        });
    }).then(() => {
        cb();
    });
    
});

test('repeat pacer', (cb) => {
    const pacer = new Pacer();
    let calledTime = 0;
    pacer.onTick = jest.fn(() => { calledTime++; });
    pacer.start();
    pacer.start();
    pacer.start();
    pacer.stop();
    Promise.resolve().then(() => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBe(0);
                resolve();
            }, 100);
        })
    }).then(() => {
        pacer.start();
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).not.toBe(0);
                resolve();
            }, 100);
        })
    }).then(() => {
        pacer.stop();
        cb();
    });
});

test('stop pacer in tick', (cb) => {
    const pacer = new Pacer();
    let calledTime = 0;
    pacer.onTick = jest.fn(() => { pacer.stop(); calledTime++; });
    pacer.start();
    Promise.resolve().then(() => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBe(1);
                resolve();
            }, 100);
        })
    }).then(() => {
        pacer.start();
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBe(2);
                resolve();
            }, 100);
        })
    }).then(() => {
        pacer.stop();
        cb();
    });
});

test('stop and restart pacer in tick', (cb) => {
    const pacer = new Pacer();
    let calledTime = 0;
    pacer.onTick = jest.fn(() => { pacer.stop(); pacer.start(); calledTime++; });
    pacer.start();
    Promise.resolve().then(() => {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBeGreaterThan(0);
                resolve();
            }, 100);
        })
    }).then(() => {
        const called = calledTime;
        pacer.stop();
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                expect(calledTime).toBe(called);
                resolve();
            }, 100);
        })
    }).then(() => {
        cb();
    });
});