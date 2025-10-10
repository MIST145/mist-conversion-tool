import { ConversionPattern } from '@/types';

export const ESX_TO_QB_PATTERNS: ConversionPattern[] = [
  // Core functions - longer patterns first for proper matching
  { from: 'local QBCore = exports[\'qb-core\']:GetCoreObject()', to: 'ESX = exports[\'es_extended\']:getSharedObject()', category: 'Core', direction: 'esx-to-qb' },
  { from: 'QBCore = exports[\'qb-core\']:GetCoreObject()', to: 'ESX = exports[\'es_extended\']:getSharedObject()', category: 'Core', direction: 'esx-to-qb' },
  
  // Player data functions
  { from: 'ESX.GetPlayerData', to: 'QBCore.Functions.GetPlayerData', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.IsPlayerLoaded', to: 'QBCore.Functions.GetPlayerData().citizenid ~= nil', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.SetPlayerData', to: 'QBCore:Player:SetPlayerData', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.TriggerServerCallback', to: 'QBCore.Functions.TriggerCallback', category: 'Client Functions', direction: 'esx-to-qb' },
  
  // Game functions
  { from: 'ESX.Game.DeleteVehicle', to: 'QBCore.Functions.DeleteVehicle', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.DeleteObject', to: 'DeleteEntity', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetClosestPed', to: 'QBCore.Functions.GetClosestPed', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetClosestPlayer', to: 'QBCore.Functions.GetClosestPlayer', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetClosestVehicle', to: 'QBCore.Functions.GetClosestVehicle', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetClosestObject', to: 'GetClosestObjectOfType', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetPedMugshot', to: 'RegisterPedheadshot', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetPlayers', to: 'QBCore.Functions.GetPlayers', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetVehicles', to: 'QBCore.Functions.GetVehicles', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetVehicleProperties', to: 'QBCore.Functions.GetVehicleProperties', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.GetVehicleInDirection', to: 'QBCore.Functions.GetVehicleInDirection', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.SpawnVehicle', to: 'QBCore.Functions.SpawnVehicle', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.SpawnObject', to: 'CreateObject', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.SetVehicleDoorsLocked', to: 'QBCore.Functions.SetVehicleDoorsLocked', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.SetVehicleProperties', to: 'QBCore.Functions.SetVehicleProperties', category: 'Client Functions', direction: 'esx-to-qb' },
  { from: 'ESX.Game.Utils.DrawText3D', to: 'QBCore.Functions.DrawText3D', category: 'Client Functions', direction: 'esx-to-qb' },
  
  // UI functions
  { from: 'ESX.ShowInventory', to: 'QBCore:Inventory', category: 'UI Functions', direction: 'esx-to-qb' },
  { from: 'ESX.ShowNotification', to: 'QBCore:Notify', category: 'UI Functions', direction: 'esx-to-qb' },
  { from: 'ESX.ShowHelpNotification', to: 'QBCore:Notify', category: 'UI Functions', direction: 'esx-to-qb' },
  { from: 'ESX.ShowAdvancedNotification', to: 'QBCore:Notify', category: 'UI Functions', direction: 'esx-to-qb' },
  
  // Server functions
  { from: 'ESX.SavePlayers', to: 'QBCore.Functions.SavePlayers', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.GetPlayerFromId', to: 'QBCore.Functions.GetPlayer', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.GetPlayerFromIdentifier', to: 'QBCore.Functions.GetPlayerByCitizenId', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.GetPlayers', to: 'QBCore.Functions.GetPlayers', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.RegisterServerCallback', to: 'QBCore.Functions.CreateCallback', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.RegisterUsableItem', to: 'QBCore.Functions.CreateUseableItem', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.SavePlayer', to: 'QBCore.Player.Save', category: 'Server Functions', direction: 'esx-to-qb' },
  { from: 'ESX.UseItem', to: 'QBCore.Functions.UseItem', category: 'Server Functions', direction: 'esx-to-qb' },
  
  // Player object methods
  { from: 'xPlayer.removeWeaponComponent', to: 'xPlayer.Functions.RemoveItem', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.setAccountMoney', to: 'xPlayer.Functions.SetMoney', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.setInventoryItem', to: 'xPlayer.Functions.AddItem', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.setJob', to: 'xPlayer.Functions.SetJob', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.setMoney', to: 'xPlayer.Functions.SetMoney', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.showHelpNotification', to: 'TriggerClientEvent(\'QBCore:Notify\')', category: 'Player Methods', direction: 'esx-to-qb' },
  { from: 'xPlayer.showNotification', to: 'TriggerClientEvent(\'QBCore:Notify\')', category: 'Player Methods', direction: 'esx-to-qb' },
  
  // Events
  { from: 'esx:addInventoryItem', to: 'QBCore:Server:AddItem', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:getSharedObject', to: 'QBCore:GetObject', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:onPlayerDeath', to: 'hospital:server:SetDeathStatus', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:onPlayerSpawn', to: 'QBCore:Client:OnPlayerLoaded', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:playerLoaded', to: 'QBCore:Client:OnPlayerLoaded', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:removeInventoryItem', to: 'QBCore:Server:RemoveItem', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:setAccountMoney', to: 'QBCore:Server:SetMoney', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:showAdvancedNotification', to: 'QBCore:Notify', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:showHelpNotification', to: 'QBCore:Notify', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:showNotification', to: 'QBCore:Notify', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:spawnVehicle', to: 'QBCore:Command:SpawnVehicle', category: 'Events', direction: 'esx-to-qb' },
  { from: 'esx:useItem', to: 'QBCore:Server:UseItem', category: 'Events', direction: 'esx-to-qb' },
  { from: 'playerSpawned', to: 'QBCore:Client:OnPlayerLoaded', category: 'Events', direction: 'esx-to-qb' },
];

export const QB_TO_ESX_PATTERNS: ConversionPattern[] = [
  // Core functions
  { from: 'local ESX = exports[\'es_extended\']:getSharedObject()', to: 'QBCore = exports[\'qb-core\']:GetCoreObject()', category: 'Core', direction: 'qb-to-esx' },
  { from: 'ESX = exports[\'es_extended\']:getSharedObject()', to: 'QBCore = exports[\'qb-core\']:GetCoreObject()', category: 'Core', direction: 'qb-to-esx' },
  
  // Player data functions
  { from: 'QBCore.Functions.GetPlayerData', to: 'ESX.GetPlayerData', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetPlayerData().citizenid ~= nil', to: 'ESX.IsPlayerLoaded', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore:Player:SetPlayerData', to: 'ESX.SetPlayerData', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.TriggerCallback', to: 'ESX.TriggerServerCallback', category: 'Client Functions', direction: 'qb-to-esx' },
  
  // Game functions
  { from: 'QBCore.Functions.DeleteVehicle', to: 'ESX.Game.DeleteVehicle', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'DeleteEntity', to: 'ESX.Game.DeleteObject', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetClosestPed', to: 'ESX.Game.GetClosestPed', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetClosestPlayer', to: 'ESX.Game.GetClosestPlayer', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetClosestVehicle', to: 'ESX.Game.GetClosestVehicle', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'GetClosestObjectOfType', to: 'ESX.Game.GetClosestObject', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'RegisterPedheadshot', to: 'ESX.Game.GetPedMugshot', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetPlayers', to: 'ESX.Game.GetPlayers', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetVehicles', to: 'ESX.Game.GetVehicles', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetVehicleProperties', to: 'ESX.Game.GetVehicleProperties', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetVehicleInDirection', to: 'ESX.Game.GetVehicleInDirection', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.SpawnVehicle', to: 'ESX.Game.SpawnVehicle', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'CreateObject', to: 'ESX.Game.SpawnObject', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.SetVehicleDoorsLocked', to: 'ESX.Game.SetVehicleDoorsLocked', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.SetVehicleProperties', to: 'ESX.Game.SetVehicleProperties', category: 'Client Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.DrawText3D', to: 'ESX.Game.Utils.DrawText3D', category: 'Client Functions', direction: 'qb-to-esx' },
  
  // UI functions
  { from: 'QBCore:Inventory', to: 'ESX.ShowInventory', category: 'UI Functions', direction: 'qb-to-esx' },
  { from: 'QBCore:Notify', to: 'ESX.ShowNotification', category: 'UI Functions', direction: 'qb-to-esx' },
  
  // Server functions
  { from: 'QBCore.Functions.SavePlayers', to: 'ESX.SavePlayers', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetPlayer', to: 'ESX.GetPlayerFromId', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetPlayerByCitizenId', to: 'ESX.GetPlayerFromIdentifier', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.GetPlayers', to: 'ESX.GetPlayers', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.CreateCallback', to: 'ESX.RegisterServerCallback', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.CreateUseableItem', to: 'ESX.RegisterUsableItem', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Player.Save', to: 'ESX.SavePlayer', category: 'Server Functions', direction: 'qb-to-esx' },
  { from: 'QBCore.Functions.UseItem', to: 'ESX.UseItem', category: 'Server Functions', direction: 'qb-to-esx' },
  
  // Player object methods
  { from: 'xPlayer.Functions.RemoveItem', to: 'xPlayer.removeWeaponComponent', category: 'Player Methods', direction: 'qb-to-esx' },
  { from: 'xPlayer.Functions.SetMoney', to: 'xPlayer.setAccountMoney', category: 'Player Methods', direction: 'qb-to-esx' },
  { from: 'xPlayer.Functions.AddItem', to: 'xPlayer.setInventoryItem', category: 'Player Methods', direction: 'qb-to-esx' },
  { from: 'xPlayer.Functions.SetJob', to: 'xPlayer.setJob', category: 'Player Methods', direction: 'qb-to-esx' },
  { from: 'TriggerClientEvent(\'QBCore:Notify\')', to: 'xPlayer.showNotification', category: 'Player Methods', direction: 'qb-to-esx' },
  
  // Events
  { from: 'QBCore:Server:AddItem', to: 'esx:addInventoryItem', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:GetObject', to: 'esx:getSharedObject', category: 'Events', direction: 'qb-to-esx' },
  { from: 'hospital:server:SetDeathStatus', to: 'esx:onPlayerDeath', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Client:OnPlayerLoaded', to: 'esx:playerLoaded', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Server:RemoveItem', to: 'esx:removeInventoryItem', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Server:SetMoney', to: 'esx:setAccountMoney', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Command:SpawnVehicle', to: 'esx:spawnVehicle', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Server:UseItem', to: 'esx:useItem', category: 'Events', direction: 'qb-to-esx' },
  { from: 'QBCore:Client:OnJobUpdate', to: 'esx:setJob', category: 'Events', direction: 'qb-to-esx' },
];

export const SQL_PATTERNS: ConversionPattern[] = [
  { from: 'exports.ghmattimysql.execute', to: 'exports.oxmysql:execute', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'exports.ghmattimysql.executeSync', to: 'exports.oxmysql:executeSync', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'exports.ghmattimysql.insert', to: 'exports.oxmysql:insert', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'exports.ghmattimysql.scalar', to: 'exports.oxmysql:scalar', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'exports.ghmattimysql.scalarSync', to: 'exports.oxmysql:scalarSync', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'MySQL.Async.execute', to: 'exports.oxmysql:execute', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'MySQL.Async.fetchAll', to: 'exports.oxmysql:fetchAll', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'MySQL.Async.fetchScalar', to: 'exports.oxmysql:fetchScalar', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'MySQL.Async.insert', to: 'exports.oxmysql:insert', category: 'SQL', direction: 'esx-to-qb' },
  { from: 'MySQL.Sync.fetchAll', to: 'exports.oxmysql:fetchAllSync', category: 'SQL', direction: 'esx-to-qb' },
];
