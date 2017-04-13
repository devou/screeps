let roleHarvester = require('role.harvester');

let roleTowerFiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: source => source.energy > 0
        });
        if(creep.pos.isNearTo(source) && creep.carry.energy <= creep.carryCapacity - _.filter(creep.body, p => p.type == WORK).length * 2) {
            creep.harvest(source);
        } else if(creep.carry.energy == 0) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        else {
            let extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity - creep.carry.energy;
                    }
            });
            if(extension) {
                if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension, {ignoreCreeps: true, visualizePathStyle: {stroke: '#ffffff'}})
                }
            } else {
                roleHarvester.run(creep);
            }
        }
	}
};

module.exports = roleTowerFiller;