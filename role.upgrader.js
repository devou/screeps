let utils = require('utils');

let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

	    if(creep.memory.work) {
            creep.upgraderWork();
        }
        else {
            creep.withdrawFromContainers();
        }
	},

    create: function(room) {
        utils.createCreep('upgrader', room);
    }
};

module.exports = roleUpgrader;