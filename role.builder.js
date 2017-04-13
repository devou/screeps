/**
 * Created by drutkovskyi on 4/13/17.
 */
var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 withdraw');
        }
        if(!creep.memory.building && creep.carry.energy > creep.carryCapacity - _.filter(creep.body, p => p.type == WORK).length * 2) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {ignoreCreeps: true});
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleUpgrader.run(creep);
            }
        }

        else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES, {
                filter: source => source.energy > 0
            });

            let extension = creep.pos.findClosestByPath(
                FIND_STRUCTURES,
                {filter: structure => (structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy > 0}
            );
            if(source && creep.pos.isNearTo(source) && creep.carry.energy < creep.carryCapacity) {
                creep.say('🔄 harvest');
                creep.harvest(source);
            } else if (extension) {
                if(creep.withdraw(extension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if(source) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if(creep.carry.energy > 0) {
                creep.build = true;
            }
        }
    }
};

module.exports = roleBuilder;