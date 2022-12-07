exports.trackEventWithTimer = function(category, id, value = 1) {
    if (!category || !id) {
        return;
    }
    Editor.Metrics._trackEventWithTimer({
        category,
        id,
        value,
    });
};
