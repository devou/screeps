var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.carry.energy > creep.carryCapacity - _.filter(creep.body, p => p.type == WORK).length * 2) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let extension = creep.pos.findClosestByPath(
                FIND_MY_STRUCTURES,
                {filter: 
                    structure => (
                        structure.structureType == STRUCTURE_CONTAINER 
                        || structure.structureType == STRUCTURE_STORAGE
                    ) && structure.store.energy > 200
                }
            );
            if (extension) {
                if(creep.withdraw(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES, {
                    filter: source => source.energy > 0
                });
                if (!source) {
                    source = _.sortByOrder(creep.room.find(FIND_SOURCES), ['ticksToRegeneration'])[0]
                }
                creep.say('🔄 harvest');
                if (!creep.pos.isNearTo(source)) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.harvest(source);
                }
            }
        }
	}
};

module.exports = roleUpgrader;