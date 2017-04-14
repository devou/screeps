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

    create: function() {
        utils.createCreep('upgrader');
    }
};

module.exports = roleUpgrader;