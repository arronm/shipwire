/*

TODO:
 - Modify so the queue can be scalable based on priority (currently if I add p6, indexing is off)

*/

class PriorityQueue {
  constructor() {
    this.queue = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };

    this.len = 5;
  };

  enqueue(task, priority=0) {
    if (this.queue[priority]) {
      this.queue[priority].push(task);
    } else {
      this.queue[0].push(task);

      // Should log and warn instead of throwing error
      // throw Error('Invalid priority given, must be one of [0, 1, 2, 3, 4]');
      process.emitWarning('Invalid priority, setting to 0', 'PriorityWarning');
    }
  };

  dequeue() {
    for (let i = 1; i < (this.len + 1); i++) {
      if (this.queue[i % this.len].length > 0) {
        return this.queue[i % this.len].shift();
      }
    }

    return false;
  };
}

module.exports = PriorityQueue;
