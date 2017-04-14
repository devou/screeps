let con = require('constants');

let roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        creep.updateWorkState();

        if (!creep.handleDroppedResources()) {
            if (creep.memory.work) {
                creep.carrierWork();
            } else {
                creep.withdrawFromSourceContainers();
            }
        }
	},

	create: function(budget=false) {
	    let creepBody = [];
	    let room = con.room;
	    let avres = budget ? room.energyAvailable : room.energyCapacityAvailable;
        let count = Math.min(avres/100, 6);

        for (count; count > 0; count--){
	        creepBody.push(CARRY);
	        creepBody.push(MOVE);
        }

	    let newName = Game.spawns['Spawn1'].createCreep(
	        creepBody, undefined, {role: 'carrier'});
        if (_.isString(newName)) {
            console.log(`Spawning new ${budget?'budget ':' '}carrier: ${newName}`);
        }
	},
};

module.exports = roleCarrier;