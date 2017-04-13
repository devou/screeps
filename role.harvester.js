let roleBuilder = require('role.builder');

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let freeEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: nrg => nrg.amount >= 20});
        if (freeEnergy && _.sum(creep.carry) < creep.carryCapacity) {
            creep.say('FREE ENERGY');
            if (creep.pickup(freeEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(freeEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(_.sum(creep.carry) > creep.carry.energy) {
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure =>
                    (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                        && structure.store.energy < structure.storeCapacity - 100
            });
            creep.say('MINERALS!!!');
            if(!creep.pos.isNearTo(container)) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                for (let resourceType in creep.carry) {
                    creep.transfer(container, resourceType);
                }
            }

        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: source => source.energy > 0
            });
            if (source) {
                if(creep.pos.isNearTo(source) && _.sum(creep.carry) <= creep.carryCapacity - _.filter(creep.body, p => p.type == WORK).length * 2) {
                    creep.harvest(source);
                } else if(creep.carry.energy == 0) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    let extension = creep.pos.findClosestByPath(
                        FIND_MY_STRUCTURES,
                        {filter: (structure) => (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) && structure.energy < structure.energyCapacity}
                    );

                    if(extension) {
                        if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: structure =>
                                (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                                    && _.sum(structure.store) < structure.storeCapacity - 100
                        });
                        if(extension) {
                            if(creep.transfer(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        }else {
                            creep.memory.building = true;
                            creep.say("I'm builder");
                            roleBuilder.run(creep);
                        }

                    }
                }
            } else {
                creep.memory.building = true;
                creep.say("I'm builder");
                roleBuilder.run(creep);
            }
        }
	}
};

module.exports = roleHarvester;