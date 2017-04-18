require('deps');
let roleBuilder = require('role.builder');
let roleContainerHarvester = require('role.containerHavester');
let roleCarrier = require('role.carrier');
let roleUpgrader = require('role.upgrader');
let utils = require('utils');
let tower = require('tower');

module.exports.loop = function () {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    try {
        let test = Game.creeps.test2;
        if (test) {
            let ss = Game.rooms.W11S91.controller;
            test.updateWorkState();
            if (test.memory.work) {
                if (test.upgradeController(ss) == ERR_NOT_IN_RANGE) {
                    test.moveTo(ss)
                }                
            } else {
                test.harvestClosestSource();
            }

        } else {
             Game.spawns.Spawn1.createCreep([MOVE, CARRY, WORK, MOVE, CARRY, WORK], 'test2');
        }
        let tess = _.filter(Game.creeps, x=>x.memory.room == 'W11S91');
        if (tess.length < 2 || (_.filter(tess, x => x.ticksToLive < 100).length > 0 && tess.length == 2)) {
            Game.spawns.Spawn1.createCreep([
                MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, 
                MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, 
                MOVE, CARRY, WORK, MOVE, CARRY, WORK], 
                undefined, {room: 'W11S91'});
        }
        for (let tes of tess) {
            if (tes.room.name !== 'W11S91') {
                tes.moveTo(Game.rooms.W11S91.controller);
            } else { 
                tes.memory.role = 'carrier';
            }
        }

        roleContainerHarvester.create(Game.rooms.W11S91);
    } 
    catch(err){   
        console.log(err);
        Game.notify(err);     
    }

    let creepCounts = _.mapValues(
        _.groupBy(_.filter(Game.creeps, x=>x.room.name!='W11S91'), 'memory.role'),
        (v) => v.length
    );
    let harvestersCount = creepCounts.harvester || 0;
    let upgradersCount = creepCounts.upgrader || 0;
    let buildersCount = creepCounts.builder || 0;
    let carriersCount = creepCounts.carrier || 0;
    Memory.harvesterCount = harvestersCount;

    // creeps creating
    if(upgradersCount < 2) {
        roleUpgrader.create();
    }else if(buildersCount < 2) {
        console.log('builder creation');
        roleBuilder.create();
    }

    if (roleContainerHarvester.isContainerHarvesterAvailable()) {
        roleContainerHarvester.create();
    } else {
        if(harvestersCount === 0) {
            utils.createCreep('harvester', true);
        } else if(harvestersCount < 2) {
            utils.createCreep('harvester');
        }
    }

    if(carriersCount < 2) {
        let carrier = _.filter(
            Game.creeps, c => c.isCarrier() && c.ticksToLive < 30);
        if (carrier.length > 0) {
            roleCarrier.create();
        }
    } else if(carriersCount < 1) {
        roleCarrier.create(true);
    }

    if(Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
    
    tower.towerLogic();

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        creep.run();
    }
}