let con = require('constants');
let roleBuilder = require('role.builder');
let roleContainerHarvester = require('role.containerHavester');
let roleCarrier = require('role.carrier');
let roleUpgrader = require('role.upgrader');
let tower = require('tower');
let utils = require('utils');

Room.prototype.handleCreeps = function() {
    if (!this.controller || !this.controller.my) {
        return false;
    }
    let creepCounts = _.mapValues(
        _.groupBy(_.filter(
            Game.creeps,
            x=>(x.room.name==this.name) || (!x.room.name && this == con.room)
        ), 'memory.role'),
        (v) => v.length
    );

    let harvestersCount = creepCounts.harvester || 0;
    let upgradersCount = creepCounts.upgrader || 0;
    let buildersCount = creepCounts.builder || 0;
    let carriersCount = creepCounts.carrier || 0;

    // creeps creating
    if(upgradersCount < 2) {
        console.log(`upgrader created: ${roleUpgrader.create(this)}`);
    }else if(buildersCount < 2) {
        console.log(`builder created: ${roleBuilder.create(this)}`);
    }

    if (roleContainerHarvester.isContainerHarvesterAvailable(this)) {
        roleContainerHarvester.create(this);
    } else {
        if(harvestersCount === 0) {
            utils.createCreep('harvester', this, true);
        } else if(harvestersCount < 2) {
            utils.createCreep('harvester', this);
        }
    }

    let oldCarrier = _.filter(
        Game.creeps,
        c => c.isCarrier() && c.memory.room == this && c.ticksToLive < 30);
    if(carriersCount < 3 && oldCarrier.length > 0 || carriersCount < 2) {
        roleCarrier.create(this);
    } else if(carriersCount < 1) {
        roleCarrier.create(this, true);
    }

    tower.towerLogic(this);
};

// let tess = _.filter(Game.creeps, x=>x.memory.room == 'W11S91');
// if (tess.length < 2 || (_.filter(tess, x => x.ticksToLive < 100).length > 0 && tess.length == 2)) {
//     Game.spawns.Spawn1.createCreep([
//         MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK,
//         MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK,
//         MOVE, CARRY, WORK, MOVE, CARRY, WORK],
//         undefined, {room: 'W11S91'});
// }
// for (let tes of tess) {
//     if (tes.room.name !== 'W11S91') {
//         tes.moveTo(Game.rooms.W11S91.controller);
//     } else {
//         tes.memory.role = 'carrier';
//     }
// }
//
// roleContainerHarvester.create(Game.rooms.W11S91);
