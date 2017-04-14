let con = require('constants');

let utils = {

    /**
     * @param {!String} role
     * @param {Boolean} budget
    **/
	createCreep: function(role, budget=false) {
	    let creepBody = [WORK, CARRY, MOVE];
	    let room = con.room;
	    let avres = budget ? room.energyAvailable - 200 : room.energyCapacityAvailable - 200;
	    if (!budget && room.energyAvailable < room.energyCapacityAvailable) {
	        return;
	    }
	    let carrys = Math.min(avres/250, 4);
	    let weight = 3;
	    let max = 18;
	    if (role === 'upgrader') {
	        max = 50;
	    }
        for (carrys; carrys > 1; carrys--){
            avres -= 50;
            weight += 1;
	        creepBody.push(CARRY);
        }
	    while (avres >= 100 && weight < max) {
	        avres -= 100;
	        weight += 1;
	        creepBody.push(WORK);
	        if (avres >= 50) {
	            avres -= 50;
	            weight += 1;
    	        creepBody.push(MOVE);
    	    }
	    }
        if (avres >= 50) {
	        creepBody.push(MOVE);
	    }

	    let newName = Game.spawns['Spawn1'].createCreep(creepBody, undefined, {role: role});
        console.log(`Spawning new ${role}: ${newName}`);
	},

	/**
	 * Find containers related to sources and store in memory
	 * @param {Room} room
	 * @param {boolean} update: force memory update
	 * @return Array<StructureContainer>
	 */
	getSourceContainers: function (room=con.room, update=false) {
		let containers;
		if (!room.memory.sourceContainerIds || update) {
			containers = room.find(
				FIND_STRUCTURES, {
					filter: structure => {
						if (structure.structureType !== STRUCTURE_CONTAINER) {
							return false;
						}
						return structure.pos.findInRange(FIND_SOURCES, 1).length >= 1;
					}
				}
			);
			room.memory.sourceContainerIds = _.map(containers, c => c.id);
		}
		if (!containers) {
			containers = _.map(
				room.memory.sourceContainerIds,
				id => Game.getObjectById(id)
			);
		}
		return containers;

	}
};

module.exports = utils;