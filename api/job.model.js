const db = require('../data/models')('job');

// return highest priority task
const getJob = async () => {
  return db.cb(async (db) => {
    const task = await db('job')
      .select('*')
      .orderByRaw('priority=0')
      .orderBy('priority')
      .orderBy('created_at')
      .limit(1)
      .first();
    return {
      ...task,
      lines: JSON.parse(task.lines),
    };
  });
};

module.exports = {
  ...db,
  getJob
};
