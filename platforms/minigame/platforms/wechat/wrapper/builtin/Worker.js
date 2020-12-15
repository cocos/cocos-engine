export default function(file) {
    const worker = wx.createWorker(file);

    return worker;
};
