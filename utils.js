let con = require('constants');

let utils = {

    /**
     * @param {!String} role
     * @param {Room} room
     * @param {Boolean} budget
    **/
	createCreep: function(role, room=con.room) {
        let spawns = _.filter(
            Game.spawns, sp => sp.room == room && !sp.spawning);
        if (!spawns) return false;
        let spawn = spawns[0];
        let isDefaultRoom = false;
        let parts = 8;
        if (room == con.room) {
            parts = 5;
            isDefaultRoom = true;
        }
        let creepBody;
        if (budget) {
            creepBody = [WORK, CARRY, CARRY, MOVE];
        } else {
            creepBody = [];
            for (let i in _.range(parts)) {
                creepBody.push(WORK);
    	        creepBody.push(CARRY);
    	        creepBody.push(MOVE);
            }
        }

	    let newName = spawn.createCreep(creepBody, undefined, {role: role, room: room.name});
        if (!isDefaultRoom && newName === ERR_NOT_ENOUGH_ENERGY) {
            newName = Game.spawns.Spawn1.createCreep(
                creepBody, undefined, {role: role, room: room.name});
        }
        console.log(`Spawning new ${role}: ${newName} at ${room.name} room`);
	},

	/**
	 * Find containers related to sources and store in memory
	 * @param {Room} room
	 * @param {boolean} update: force memory update
	 * @return Array<StructureContainer>
	 */
	getSourceContainers: function (room=con.room, update=false) {
		let containers;
		if (! room.memory.counter || room.memory.counter >= 100) {
		    update = true;
		    room.memory.counter = 0;
        } else {
            room.memory.counter += 1;
        }

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