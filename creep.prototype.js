let roleContainerHarvester = require('role.containerHavester');
let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleCarrier = require('role.carrier');


Creep.prototype.isHarvester = function() {return this.memory.role === 'harvester'};
Creep.prototype.isBuilder = function() {return this.memory.role === 'builder'};
Creep.prototype.isUpgrader = function() {return this.memory.role === 'upgrader'};
Creep.prototype.isCarrier = function() {return this.memory.role === 'carrier'};
Creep.prototype.isContainerHarvester = function() {return this.memory.role === 'containerHarvester'};


Creep.prototype.run = function() {
    if (this.isContainerHarvester()) {
        roleContainerHarvester.run(this);
    } else if (this.isHarvester()) {
        roleHarvester.run(this);
    } else if (this.isBuilder()) {
        roleBuilder.run(this);
    } else if (this.isUpgrader()) {
        roleUpgrader.run(this);
    } else if (this.isCarrier()) {
        roleCarrier.run(this);
    }
};


Creep.prototype.updateWorkState = function() {
    if (this.memory.work && this.carry.energy === 0) {
        this.memory.work = false;
        this.say('♲ withdraw');
    }
    if (!this.memory.work && this.carry.energy === this.carryCapacity) {
        this.memory.work = true;
        this.say('work');
    }

};


Creep.prototype.harvestClosestSource = function() {
    let source = this.pos.findClosestByPath(FIND_SOURCES, {
        filter: source => source.energy > 0
    });
    if (source) {
        if (this.pos.isNearTo(source) && _.sum(this.carry) <= this.carryCapacity) {
            this.harvest(source);
        } else {
            this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    } else {
        return false;
    }
};


Creep.prototype.withdrawFromSourceContainers = function() {
    let container = this.pos.findClosestByPath(
        this.room.memory.sourceContainers, {
            filter: structure => structure.store.energy > 0
        }
    );
    if (container) {
        if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(container, {visualizePathStyle: {stroke: '#e522ff'}});
        }
        return true;
    }
    return false;
};


Creep.prototype.withdrawFromContainers = function() {
    let container = this.pos.findClosestByPath(
        FIND_STRUCTURES, {
            filter: structure =>
            (structure.structureType === STRUCTURE_CONTAINER)
            && structure.store.energy > 0
        }
    );
    if (container) {
        if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(container, {visualizePathStyle: {stroke: '#7819ff'}});
        }
        return true;
    }
    return false;
};


Creep.prototype.builderWork = function() {
    let target = this.pos.findClosestByPath(
        FIND_CONSTRUCTION_SITES, {ignoreCreeps: true});
    if (target) {
        if (this.build(target) === ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#582c15'}});
        }
        return true;
    }
    return false;
};


Creep.prototype.upgraderWork = function() {
    let controller = this.room.controller;
    if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(controller, {visualizePathStyle: {stroke: '#51ff48'}});
        return true;
    }
    return false;
};


Creep.prototype.carrierWork = function() {
    let whereToPutEnergy = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType === STRUCTURE_EXTENSION &&
            structure.energy < structure.energyCapacity
        }) || this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType === STRUCTURE_SPAWN &&
            structure.energy < structure.energyCapacity
        }) || this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType === STRUCTURE_TOWER &&
            structure.energy < structure.energyCapacity - this.carry.energy
        }) || this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType === STRUCTURE_CONTAINER &&
            this.room.memory.sourceContainers.indexOf(structure) === -1 &&
            _.sum(structure.store) < structure.storeCapacity - this.carry.energy
        }) || this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType === STRUCTURE_STORAGE &&
            _.sum(structure.store) < structure.storeCapacity
        });
    if (whereToPutEnergy) {
        if (this.transfer(whereToPutEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.moveTo(whereToPutEnergy, {
                ignoreCreeps: true,
                visualizePathStyle: {stroke: '#ff464d'}
            })
        }
        return true;
    }
    return false;
};


Creep.prototype.handleDroppedResources = function() {
    let droppedResource = this.pos.findClosestByPath(
        FIND_DROPPED_RESOURCES, {filter: res => res.amount >= 20});
    if (droppedResource && _.sum(this.carry) < this.carryCapacity) {
        this.say('free energy');
        if (this.pickup(droppedResource) === ERR_NOT_IN_RANGE) {
            this.moveTo(droppedResource,
                {visualizePathStyle: {stroke: '#02afff'}});
        }
        return true;
    } else if (_.sum(this.carry) > this.carry.energy) {
        let container = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            (structure.structureType === STRUCTURE_CONTAINER ||
            structure.structureType === STRUCTURE_STORAGE)
            && structure.store.energy < structure.storeCapacity - 100
        });
        this.say('minerals');
        if (!this.pos.isNearTo(container)) {
            this.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            for (let resourceType in this.carry) {
                this.transfer(container, resourceType);
            }
        }
        return true;
    }
    return false;
};