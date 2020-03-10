const db = require('../data/models')('job');

// return highest priority job
const getJob = async () => {
  return db.cb(async (db) => {
    const job = await db('job')
      .select('*')
      .orderByRaw('priority=0')
      .orderBy('priority')
      .orderBy('created_at')
      .limit(1)
      .first();
    if (job) {
      return {
        ...job,
        lines: JSON.parse(job.lines),
      };
    }

    return job;
  });
};

module.exports = {
  ...db,
  getJob
};
