let utils = require('utils');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

        if(creep.memory.work) {
            creep.repairerWork() || creep.upgraderWork();
        } else {
            creep.withdrawFromContainers();
        }
    },

    create: function(room) {
        utils.createCreep('repairer', room);
    },

    expectedCount: function(room) {
        return room.find(FIND_STRUCTURES, {
        filter: structure => (structure.hits <= structure.hitsMax - 500)
        && structure.hitsMax > 300000}).length > 0 ? 1 : 0;
    }
};

module.exports = roleBuilder;