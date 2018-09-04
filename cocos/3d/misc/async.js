function parallel(tasks, callback) {
  let length = tasks.length;
  if (length === 0) {
    callback(null);
  }

  let completed = 0;

  for (let i = 0; i < tasks.length; ++i) {
    let task = tasks[i];
    task(err => {
      if (err) {
        callback(err);
      } else if (++completed === length) {
        callback(null);
      }
    });
  }
}

export default {
  parallel
};