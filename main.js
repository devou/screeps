let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleTowerFiller = require('role.towerfiller');
let utils = require('utils');
let tower = require('tower');

module.exports.loop = function () {
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    let creeps = _.groupBy(Game.creeps, 'memory.role')
    let harvestersCount = creeps['harvester'] && creeps['harvester'].length || 0;
    let upgraidersCount = creeps['upgrader'] && creeps['upgrader'].length || 0;
    let buildersCount = creeps['builder'] && creeps['builder'].length || 0;
    let towerFillersCount = creeps['towerFiller'] && creeps['towerFiller'].length || 0;
    Memory.harvesterCount = harvestersCount;

    if(harvestersCount === 0) {
        utils.createCreep('harvester', true);
    } else {
        if(harvestersCount < 1) {
            utils.createCreep('harvester');
        }else if(upgraidersCount < 1) {
            utils.createCreep('upgrader');
        }else if(buildersCount < 1) {
            utils.createCreep('builder');
        }else if(towerFillersCount < 1) {
            utils.createCreep('towerFiller');
        }
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
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
            // roleBuilder.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role === 'towerFiller') {
            roleTowerFiller.run(creep);
        }
    }
}