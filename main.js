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

    let creepCounts = _.mapValues(
        _.groupBy(Game.creeps, 'memory.role'),
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